#!/usr/bin/env node
/** 对本次 legion node lane 产物运行 `metadata.tests`：加载 wasm invoke 与 glue 后在 node 进程内比对。 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { isArtifactCacheFresh } from '@nyar/valkyrie';
import { resolveCompileTargetPlan } from '../src/adapters/shared/compile-target-plan.ts';
import { readNodeExecutionPinFromEnv } from '../src/adapters/shared/execution-pin.ts';
import { extractTestFailureIndex, formatSolverResultLine, type SolverCaseStats } from '../src/adapters/shared/solver-case-stats.ts';
import {
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
import { assertTestCase, normalizeTsTestResult } from '../src/domain/assert.ts';
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
        const ordered = orderArgsBySchema(abi.lookup.exportSchema, args);
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
                const actual = normalizeTsTestResult(await runCandidate(host, entry, case_.args, needsAbi ? abi : null));
                const expected = normalizeTsTestResult(case_.expected);
                if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                    throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
                }
            }
            pass += 1;
        } catch (err) {
            const message = String(err);
            emitStats({
                ok: false,
                testCaseTotal: tests.length,
                testCasePass: pass,
                testCaseFail: tests.length - pass,
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
        testCasePass: pass,
        testCaseFail: 0,
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
        testCasePass: 0,
        testCaseFail: 0,
        firstFailureIndex: extractTestFailureIndex(message),
        firstFailure: message,
    });
    console.error(message);
    process.exit(1);
});
