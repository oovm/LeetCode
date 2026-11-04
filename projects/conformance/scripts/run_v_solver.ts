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
import { isOperationSequenceCase, operationSequenceUnsupportedReason } from '../src/domain/operation-sequence.ts';
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
    // 设计类题目的操作序列需要类实例句柄；wasm 单入口 ABI 还不能表达，
    // 明确报结构化 blocked，绝不把导出类当函数调用。
    if (tests.some((test) => isOperationSequenceCase(test))) {
        const message = operationSequenceUnsupportedReason('valkyrie-wasm');
        emitStats({
            ok: false,
            testCaseTotal: tests.length,
            executed_pass: 0,
            executed_fail: 0,
            blocked: tests.length,
            not_run: 0,
            firstFailureIndex: 0,
            firstFailure: message,
        });
        console.error(message);
        return 1;
    }
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
