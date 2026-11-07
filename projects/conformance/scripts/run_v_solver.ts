#!/usr/bin/env node
/** 对本次 legion node lane 产物运行 `metadata.tests`：加载 wasm invoke 与 glue 后在 node 进程内比对。 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { isArtifactCacheFresh } from '@nyar/valkyrie';
import { resolveCompileTargetPlan } from '../src/adapters/shared/compile-target-plan.ts';
import { readNodeExecutionPinFromEnv } from '../src/adapters/shared/execution-pin.ts';
import {
    extractTestFailureIndex,
    formatSolverResultLine,
    isBlockedSolverMessage,
    type SolverCaseStats,
} from '../src/adapters/shared/solver-case-stats.ts';
import {
    matchWasmExportSymbol,
    type AbiExport,
    type AbiParameter,
    type LibraryInvokeSchema,
    loadLibraryInvokeSchema,
    orderArgsBySchema,
} from '../src/adapters/valkyrie-node/abi.ts';
import {
    ensureVBuild,
    loadMetadata,
    requireValkyrieInvokeEntry,
    resolveVBuildArtifacts,
    resolveWasmExportSymbol,
    type VBuildArtifacts,
    wasmInvokeBlockedReason,
} from '../src/adapters/valkyrie-node/ref.ts';
import { valkyrieProjectDir } from '../src/catalog/index.ts';
import { assertRejectsTestCase, normalizeTsTestResult } from '../src/domain/assert.ts';
import { isOperationSequenceCase, operationStepPath } from '../src/domain/operation-sequence.ts';
import type { OperationSequenceCase } from '../src/domain/problem.ts';
import { normalizeResultByAbiType, preserveI64Precision } from '../src/isolated/v-shared.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../src/domain/paths.ts';

type InvokeHost = {
    invokeLeetCode?: (entry: string, args: Record<string, unknown>) => unknown;
    callExport?: (name: string, ...args: unknown[]) => unknown;
};

async function loadInvokeHost(mjsPath: string): Promise<InvokeHost> {
    return (await import(pathToFileURL(mjsPath).href)) as InvokeHost;
}

type AbiLookup = {
    exportSymbol: string;
    exportSchema: AbiExport;
};

/**
 * 从 ABI schema 中找到 entry 对应的 export 声明。
 * entry 形如 `Solution().twoSum`，先剥出 export symbol 再查 schema.exports。
 */
function lookupAbiExport(schema: LibraryInvokeSchema, entry: string): AbiLookup {
    const expected = resolveWasmExportSymbol(entry);
    const available = Object.keys(schema.exports);
    const match = matchWasmExportSymbol(expected, available);
    const exportSchema = match ? schema.exports[match.symbol] : undefined;
    if (!match || !exportSchema) {
        throw new Error(
            `ABI schema 里找不到 export "${expected}"（来自 entry "${entry}"）。` +
                `schema 里已注册的 export: ${available.join(', ') || '(none)'}`,
        );
    }
    return { exportSymbol: match.symbol, exportSchema };
}

/**
 * 按 ABI schema 的 params/returns 做 marshal/unmarshal。
 * params 带 `{index, name, type, carrier}`：位置由 index 决定，取值按 name 从 metadata 供货。
 */
async function runCandidate(
    host: InvokeHost,
    entry: string,
    args: Record<string, unknown>,
    abi: { schema: LibraryInvokeSchema; lookup: AbiLookup } | null,
): Promise<unknown> {
    if (typeof host.invokeLeetCode === 'function') {
        return host.invokeLeetCode(entry, args);
    }
    if (typeof host.callExport === 'function') {
        if (!abi) {
            throw new Error(
                'callExport 路径需要 ABI schema，但 schema 未加载。' + '请确认 wasm artifact 包含 nyar.library_invoke custom section。',
            );
        }
        // 值的 marshal/unmarshal 由产物自带 node glue（callExport）按同一份 schema 完成；
        // harness 只按 schema 的参数身份把 metadata args 展开成位置参数，并按 ABI 类型
        // 递归把 i64（含数组元素）规整为精确十进制文本，不维护第二套 ABI 桥。
        const ordered = orderArgsBySchema(abi.lookup.exportSchema, args).map((value, index) => {
            const param = abi.lookup.exportSchema.params[index];
            return param ? preserveI64Precision(param.type, value, `args.${param.name}`) : value;
        });
        const raw = host.callExport(abi.lookup.exportSymbol, ...ordered);
        return raw instanceof Promise ? await raw : raw;
    }
    throw new Error('node glue 未暴露 invokeLeetCode / callExport，无法 invoke wasm 产物');
}

function emitStats(stats: SolverCaseStats): void {
    console.log(formatSolverResultLine(stats));
}

/** 没有可执行期望的哨兵语料；与 `Execution timed out` 占位语料同义。 */
const NO_EXECUTABLE_EXPECTATION = 'Execution timed out';

function isNoExecutableExpectation(testCase: { expected: unknown }): boolean {
    return typeof testCase.expected === 'string' && testCase.expected === NO_EXECUTABLE_EXPECTATION;
}

/** 整数 ABI 参数收到非整数：输入送不进去，不是实现失败。 */
function isUnrepresentableIntegerArgumentMessage(message: string): boolean {
    return message.includes('需要整数实参，实际为非整数数值');
}

/** 预检实参能否按 ABI 类型送达；只有非整数送 `i64` 这一种情况返回 true。 */
function hasUnrepresentableIntegerArgument(
    testCase: { args: Record<string, unknown> },
    abi: { schema: LibraryInvokeSchema; lookup: AbiLookup } | null,
): boolean {
    if (!abi) {
        return false;
    }
    try {
        orderArgsBySchema(abi.lookup.exportSchema, testCase.args).map((value, index) => {
            const param = abi.lookup.exportSchema.params[index];
            return param ? preserveI64Precision(param.type, value, `args.${param.name}`) : value;
        });
        return false;
    } catch (err) {
        if (isUnrepresentableIntegerArgumentMessage(String(err))) {
            return true;
        }
        // 其他实参错误留给正常执行路径按用例失败统计，避免预检改变失败口径。
        return false;
    }
}

/** 按 schema 的 `index` 升序取参数；操作入口剥掉常驻的实例句柄首参。 */
function orderedParameters(schema: AbiExport, skipInstance: boolean, label: string): AbiParameter[] {
    const params = [...schema.params].sort((left, right) => left.index - right.index);
    if (!skipInstance) {
        if (params.some((param) => param.type.kind === 'InstanceHandle')) {
            throw new Error(`${label}: 构造入口不得带实例句柄参数`);
        }
        return params;
    }
    if (params.length === 0 || params[0]!.type.kind !== 'InstanceHandle') {
        throw new Error(`${label}: 操作入口的首参不是 InstanceHandle，不能作为设计类实例方法`);
    }
    return params.slice(1);
}

/** 把操作序列的位置实参按 schema 类型展开；i64 保持精确十进制文本。 */
function positionalArguments(params: readonly AbiParameter[], values: readonly unknown[], path: string): unknown[] {
    if (params.length !== values.length) {
        throw new Error(`${path}: 需要 ${params.length} 个实参，实际 ${values.length}`);
    }
    return params.map((param, index) => preserveI64Precision(param.type, values[index], `${path}[${index}] (${param.name})`));
}

async function callHostExport(
    callExport: NonNullable<InvokeHost['callExport']>,
    symbol: string,
    args: readonly unknown[],
): Promise<unknown> {
    const raw = callExport(symbol, ...args);
    return raw instanceof Promise ? await raw : raw;
}

/**
 * 设计类操作序列：构造一次实例句柄，再逐步调用逐方法导出。
 *
 * 实例身份由 wasm glue 的不透明句柄保持；harness 只按 schema 的参数位置展开
 * metadata 实参、按每步返回类型规约后比较。构造类名不符、方法缺失、返回实例
 * 句柄或参数数量不符都按结构化错误失败，不静默跳过。
 */
async function runOperationSequenceCases(
    host: InvokeHost,
    entry: string,
    abi: { schema: LibraryInvokeSchema; lookup: AbiLookup },
    tests: OperationSequenceCase[],
    rawTotal: number,
    skipped: number,
): Promise<number> {
    const callExport = host.callExport;
    if (typeof callExport !== 'function') {
        throw new Error('设计类操作序列需要 node glue 的 callExport 与实例句柄，当前产物只暴露 invokeLeetCode');
    }
    if (abi.lookup.exportSchema.returns.kind !== 'InstanceHandle') {
        throw new Error(
            `设计类入口 "${entry}" 的构造返回不是 InstanceHandle（实际 ${abi.lookup.exportSchema.returns.kind}）`,
        );
    }
    const constructorParams = orderedParameters(abi.lookup.exportSchema, false, `构造入口 "${entry}"`);

    let pass = 0;
    for (const [index, testCase] of tests.entries()) {
        const sequence = testCase.args;
        const operations = sequence.operations;
        try {
            if (operations[0] !== entry) {
                throw new Error(
                    `${operationStepPath(index, 0, operations[0] ?? '?')}: 第 0 步应为构造 "${entry}"，实际为 ${JSON.stringify(operations[0])}`,
                );
            }
            const constructorArgs = positionalArguments(
                constructorParams,
                sequence.arguments[0] ?? [],
                `tests[${index}].step[0].arguments`,
            );
            const instance = await callHostExport(callExport, abi.lookup.exportSymbol, constructorArgs);
            if (instance === null || instance === undefined) {
                throw new Error(`${operationStepPath(index, 0, operations[0])}: 构造返回了空实例句柄`);
            }
            for (let step = 1; step < operations.length; step += 1) {
                const operation = operations[step]!;
                const path = operationStepPath(index, step, operation);
                const lookup = lookupAbiExport(abi.schema, operation);
                const methodParams = orderedParameters(lookup.exportSchema, true, `操作 "${operation}"`);
                const stepArgs = positionalArguments(methodParams, sequence.arguments[step] ?? [], `${path}.arguments`);
                const raw = await callHostExport(callExport, lookup.exportSymbol, [instance, ...stepArgs]);
                const returns = lookup.exportSchema.returns;
                if (returns.kind === 'InstanceHandle') {
                    throw new Error(`${path}: 操作返回实例句柄，宿主无法按值断言`);
                }
                const actual = returns.kind === 'Unit' ? null : normalizeResultByAbiType(normalizeTsTestResult(raw), returns);
                const expected =
                    returns.kind === 'Unit'
                        ? (testCase.expected[step] ?? null)
                        : normalizeResultByAbiType(normalizeTsTestResult(testCase.expected[step]), returns);
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`${path}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
                }
            }
            pass += 1;
        } catch (err) {
            const message = String(err);
            const infrastructureBlocked = isBlockedSolverMessage(message);
            emitStats({
                ok: false,
                testCaseTotal: rawTotal,
                executed_pass: pass,
                executed_fail: infrastructureBlocked ? 0 : 1,
                blocked: infrastructureBlocked ? rawTotal - skipped - pass : 0,
                not_run: infrastructureBlocked ? 0 : rawTotal - skipped - pass - 1,
                skipped,
                firstFailureIndex: extractTestFailureIndex(message) ?? index,
                firstFailure: message,
            });
            console.error(message);
            return 1;
        }
    }

    emitStats({
        ok: true,
        testCaseTotal: rawTotal,
        executed_pass: pass,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
        skipped,
        firstFailureIndex: null,
        firstFailure: null,
    });
    return 0;
}

async function main(): Promise<number> {
    const problemDir = process.argv[2];
    if (!problemDir) {
        console.error('usage: run_v_solver.ts <problem-dir>');
        return 2;
    }

    const meta = JSON.parse(readFileSync(join(problemDir, 'metadata.json'), 'utf8')) as {
        id?: string;
    };
    const slug = meta.id;
    if (!slug) {
        throw new Error('metadata.id 缺失');
    }

    const problem = { id: slug };
    const projectDir = valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);

    let artifacts: VBuildArtifacts | null = null;
    const pinned = readNodeExecutionPinFromEnv();
    if (pinned) {
        const freshness = isArtifactCacheFresh(pinned.artifactDir, pinned.compileTarget);
        if (!freshness.fresh) {
            throw new Error(freshness.reason ?? 'pinned execution manifest stale');
        }
        artifacts = {
            outDir: pinned.artifactDir,
            entry: {
                legionMjs: pinned.legionMjs,
                legionWasm: pinned.legionWasm,
                physicalEntry: pinned.physicalEntry,
            },
        };
    } else {
        const plan = resolveCompileTargetPlan(projectDir);
        const buildOutcome = ensureVBuild(problem, plan);
        if (buildOutcome.error) {
            throw new Error(buildOutcome.error);
        }
        artifacts = buildOutcome.artifacts ?? resolveVBuildArtifacts(problem);
    }
    if (!artifacts) {
        throw new Error('legion build 未产出可执行产物');
    }

    const { tests, invoke } = loadMetadata(problemDir);
    const entry = requireValkyrieInvokeEntry(invoke);
    const blocked = wasmInvokeBlockedReason(artifacts.entry.legionWasm, entry);
    if (blocked) {
        throw new Error(blocked);
    }

    // ── 加载 ABI schema（callExport 路径必需）─────────────────────────────────
    // 如果 node glue 只暴露 invokeLeetCode（结构化 JSON 接口），schema 可以跳过。
    // 但只要走 callExport——参数类型与 glue 身份就必须由 schema 来，不按题目名特判。
    const wasmBytes = readFileSync(artifacts.entry.legionWasm);
    const abiSchema = loadLibraryInvokeSchema(wasmBytes);
    const abiLookup = lookupAbiExport(abiSchema, entry);
    const abi = { schema: abiSchema, lookup: abiLookup };

    const host = await loadInvokeHost(artifacts.entry.legionMjs);
    // host.callExport 存在则走 ABI marshal/unmarshal；只暴露 invokeLeetCode 时 abi 参数可省
    const needsAbi = typeof host.callExport === 'function';

    // ── 无期望语料：哨兵与非整数实参不进 pass/fail 分母 ──────────────────────
    const skippedApriori = tests.filter(isNoExecutableExpectation).length;
    const rawTotal = tests.length;
    const executableCases = tests
        .map((testCase, index) => ({ testCase, index }))
        .filter(({ testCase }) => !isNoExecutableExpectation(testCase));

    // 设计类题目：构造一次实例句柄 + 逐操作调用，逐步断言。
    const sequenceCases = executableCases.filter(
        (item): item is { testCase: OperationSequenceCase; index: number } => isOperationSequenceCase(item.testCase),
    );
    if (sequenceCases.length > 0) {
        if (sequenceCases.length !== executableCases.length) {
            throw new Error('同一道题混用了单入口用例与操作序列用例，无法判定执行模型');
        }
        return await runOperationSequenceCases(host, entry, abi, sequenceCases.map(({ testCase }) => testCase), rawTotal, skippedApriori);
    }

    let pass = 0;
    // 送不进 ABI 的实参也预先计入 skipped：即使中途因其他用例失败中止，skipped 仍是全量。
    const unrepresentableIndices = new Set<number>();
    if (needsAbi) {
        for (const { testCase, index } of executableCases) {
            if (hasUnrepresentableIntegerArgument(testCase, abi)) {
                unrepresentableIndices.add(index);
            }
        }
    }
    const skipped = skippedApriori + unrepresentableIndices.size;
    for (const { testCase: case_, index } of executableCases) {
        if (unrepresentableIndices.has(index)) {
            continue;
        }
        try {
            if (typeof case_.expected === 'string' && case_.expected.startsWith('Error:')) {
                await assertRejectsTestCase(index, case_.expected, () =>
                    runCandidate(host, entry, case_.args, needsAbi ? abi : null),
                );
            } else {
                const actualRaw = normalizeTsTestResult(await runCandidate(host, entry, case_.args, needsAbi ? abi : null));
                const expectedRaw = normalizeTsTestResult(case_.expected);
                // 按 ABI 返回类型把整数结果规整为精确十进制文本再比较；
                // 无 ABI（invokeLeetCode 路径）时退回结构比较。
                const returns = abi?.lookup.exportSchema.returns;
                const actual = returns ? normalizeResultByAbiType(actualRaw, returns) : actualRaw;
                const expected = returns ? normalizeResultByAbiType(expectedRaw, returns) : expectedRaw;
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
                }
            }
            pass += 1;
        } catch (err) {
            const message = String(err);
            const infrastructureBlocked = isBlockedSolverMessage(message);
            emitStats({
                ok: false,
                testCaseTotal: rawTotal,
                executed_pass: pass,
                executed_fail: infrastructureBlocked ? 0 : 1,
                blocked: infrastructureBlocked ? rawTotal - skipped - pass : 0,
                not_run: infrastructureBlocked ? 0 : rawTotal - skipped - pass - 1,
                skipped,
                firstFailureIndex: extractTestFailureIndex(message) ?? index,
                firstFailure: message,
            });
            console.error(message);
            return 1;
        }
    }

    emitStats({
        ok: true,
        testCaseTotal: rawTotal,
        executed_pass: pass,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
        skipped,
        firstFailureIndex: null,
        firstFailure: null,
    });
    return 0;
}

main().catch((err) => {
    const message = String(err);
    emitStats({
        ok: false,
        testCaseTotal: 0,
        executed_pass: 0,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
        skipped: 0,
        firstFailureIndex: extractTestFailureIndex(message),
        firstFailure: message,
    });
    console.error(message);
    process.exit(1);
});
