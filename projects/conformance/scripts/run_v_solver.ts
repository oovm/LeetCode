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
    type AbiExport,
    type AbiParameter,
    type LibraryInvokeSchema,
    loadLibraryInvokeSchema,
    orderArgsBySchema,
    type WasmAbiType,
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
import { assertTestCase, normalizeTsTestResult } from '../src/domain/assert.ts';
import { coerceIntegerArgument, I64_MAX, I64_MIN, integerResultText } from '../src/domain/integer-literal.ts';
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
    const exportSymbol = resolveWasmExportSymbol(entry);
    const exportSchema = schema.exports[exportSymbol];
    if (!exportSchema) {
        const available = Object.keys(schema.exports);
        throw new Error(
            `ABI schema 里找不到 export "${exportSymbol}"（来自 entry "${entry}"）。` +
                `schema 里已注册的 export: ${available.join(', ') || '(none)'}`,
        );
    }
    return { exportSymbol, exportSchema };
}

/**
 * `i64` 参数以十进制字符串交给 node glue。
 *
 * `metadata.json` 经 `JSON.parse` 后，绝对值超过 $2^{53}-1$ 的整数已丢失低位；
 * 而 glue 的 `BigInt(number)` 取的是丢失后的二进制值。`Number.prototype.toString()`
 * 返回最短且可往返的十进制文本，`BigInt("...")` 能按原始文本精确恢复，
 * 从而让 wasm lane 与 `ovm`/managed lane 看到同一个整数。
 *
 * 新表示：超出安全整数的整数在 metadata 里直接写成十进制字符串，
 * `coerceIntegerArgument` 按十进制解析校验后把精确文本原样交给 glue，
 * 越出 `[i64::MIN, i64::MAX]` 时抛结构化错误，绝不静默截断。
 */
function preserveI64Precision(param: AbiParameter, value: unknown): unknown {
    if (param.type.kind !== 'I64') {
        return value;
    }
    return coerceIntegerArgument(value, I64_MIN, I64_MAX, `args.${param.name}`) ?? value;
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
        // harness 只按 schema 的参数身份把 metadata args 展开成位置参数，不维护第二套 ABI 桥。
        const ordered = orderArgsBySchema(abi.lookup.exportSchema, args).map((value, index) =>
            preserveI64Precision(abi.lookup.exportSchema.params[index] as AbiParameter, value),
        );
        const raw = host.callExport(abi.lookup.exportSymbol, ...ordered);
        return raw instanceof Promise ? await raw : raw;
    }
    throw new Error('node glue 未暴露 invokeLeetCode / callExport，无法 invoke wasm 产物');
}

/**
 * 按 ABI 返回类型把整数结果（含数组元素）规整为精确十进制文本。
 *
 * expected 在 metadata 里可能是十进制字符串（新表示，精确）或数值（≤2^53 精确）；
 * actual 可能是数值或 `bigint`。类型为 `I64`/`I32` 时统一规整为十进制文本再比较，
 * 数组/定长数组递归处理，其余类型（`Utf8`、`Bool` 等）保持原值按结构比较。
 */
function normalizeResultByAbiType(value: unknown, type: WasmAbiType): unknown {
    if (type.kind === 'I64' || type.kind === 'I32') {
        return integerResultText(value) ?? value;
    }
    if ((type.kind === 'Array' || type.kind === 'FixedArray') && Array.isArray(value)) {
        return value.map((item) => normalizeResultByAbiType(item, type.element));
    }
    return value;
}

function emitStats(stats: SolverCaseStats): void {
    console.log(formatSolverResultLine(stats));
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

    let pass = 0;
    for (const [index, case_] of tests.entries()) {
        try {
            if (typeof case_.expected === 'string' && case_.expected.startsWith('Error:')) {
                assertTestCase(index, case_.expected, () => {
                    void runCandidate(host, entry, case_.args, needsAbi ? abi : null);
                });
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
                testCaseTotal: tests.length,
                executed_pass: pass,
                executed_fail: infrastructureBlocked ? 0 : 1,
                blocked: infrastructureBlocked ? tests.length - pass : 0,
                not_run: infrastructureBlocked ? 0 : tests.length - pass - 1,
                firstFailureIndex: extractTestFailureIndex(message) ?? index,
                firstFailure: message,
            });
            console.error(message);
            return 1;
        }
    }

    emitStats({
        ok: true,
        testCaseTotal: tests.length,
        executed_pass: pass,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
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
        firstFailureIndex: extractTestFailureIndex(message),
        firstFailure: message,
    });
    console.error(message);
    process.exit(1);
});
