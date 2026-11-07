#!/usr/bin/env node
/** 对旧 OVM lane 产物运行 `metadata.tests`（通过 @nyar/valkyrie N-API 调用 `.nyar` 导出）。 */
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { arch, platform } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { isArtifactCacheFresh, legionInvokeOvmExport } from '@nyar/valkyrie';

import { readNyarExecutionPinFromEnv } from '../src/adapters/shared/execution-pin.ts';
import { compareIntegerResult, isUnsafeIntegerLiteralString } from '../src/domain/integer-literal.ts';
import {
    extractTestFailureIndex,
    formatSolverResultLine,
    isBlockedSolverMessage,
    type SolverCaseStats,
} from '../src/adapters/shared/solver-case-stats.ts';
import { assertTestCase, normalizeTsTestResult } from '../src/domain/assert.ts';
import { compareModeForExecution, formatValue, resultsMatch } from '../src/domain/compare-mode.ts';
import { problemIdFromDir } from '../src/domain/metadata.ts';
import { valkyrieProjectDir } from '../src/catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../src/domain/paths.ts';
import {
    ensureNyarBuild,
    loadMetadata,
    resolveNyarBuildArtifacts,
    nyarInvokeBlockedReason,
    type NyarVmArtifacts,
} from '../src/adapters/valkyrie-nyar/ref.ts';
import { resolveLaneTargetPlan } from '../src/adapters/shared/compile-target-plan.ts';
import { NYAR_BUILD_TARGET } from '../src/adapters/valkyrie-nyar/valkyrie.ts';
import { resolveWasmExportSymbol } from '../src/adapters/valkyrie-node/ref.ts';

type OvmNativeAddon = {
    legionInvokeOvmExport: (module: string, entry: string, argsJson: string) => string;
};

/**
 * 直接加载平台 `valkyrie-napi` 绑定，绕过包装层的 `JSON.stringify(args)`。
 *
 * ovm 的 `json_bridge.rs` 只把 JSON **数字**按 `as_i64` 精确解析，字符串会变成
 * `Value::String` 触发 type mismatch。因此超安全整数的十进制字符串必须以**裸数字文本**
 * 注入 argsJson，serde 才能按 `as_i64` 精确还原；这是 ovm 侧接收字符串整数的唯一通道。
 */
function loadOvmNative(): OvmNativeAddon | null {
    const require = createRequire(import.meta.url);
    const override = process.env.VALKYRIE_NATIVE;
    if (override && override.trim().length > 0) {
        return require(override) as OvmNativeAddon;
    }
    const os = platform();
    const cpu = arch();
    const triple =
        os === 'win32' && cpu === 'x64'
            ? 'win32-x64-msvc'
            : os === 'linux' && cpu === 'x64'
              ? 'linux-x64-gnu'
              : os === 'darwin'
                ? `darwin-${cpu}`
                : `${os}-${cpu}`;
    const short = triple.startsWith('win32-') ? 'win32-x64' : triple.startsWith('linux-') ? 'linux-x64' : triple;
    const binary = `valkyrie.${triple}.node`;
    // `@nyar/valkyrie` 是 workspace Junction，沿 realpath 找真实包目录，再按候选路径找平台 .node
    const scriptDir = dirname(fileURLToPath(import.meta.url));
    let packageRoot: string | null = null;
    try {
        packageRoot = realpathSync(join(scriptDir, '..', 'node_modules', '@nyar', 'valkyrie'));
    } catch {
        return null;
    }
    const candidates = [
        join(packageRoot, 'platforms', `valkyrie-${short}`, 'lib', binary),
        join(packageRoot, 'platforms', `valkyrie-${short}`, binary),
        join(packageRoot, '..', '..', 'node_modules', `@nyar/valkyrie-${short}`, 'lib', binary),
        join(packageRoot, '..', '..', 'platforms', `valkyrie-${short}`, 'lib', binary),
        join(packageRoot, '..', '..', 'platforms', `valkyrie-${short}`, binary),
    ];
    for (const candidate of candidates) {
        if (existsSync(candidate)) {
            return require(candidate) as OvmNativeAddon;
        }
    }
    return null;
}

/** 把单个实参序列化为 argsJson 片段；超安全整数的字符串整数注入为裸数字文本。 */
function serializeOvmArg(value: unknown): string {
    if (isUnsafeIntegerLiteralString(value)) {
        return value;
    }
    return JSON.stringify(value);
}

let cachedNative: OvmNativeAddon | null | undefined;

function runNyarExport(nyarPath: string, exportName: string, args: Record<string, unknown>): unknown {
    const hasUnsafeInteger = Object.values(args).some((value) => isUnsafeIntegerLiteralString(value));
    if (!hasUnsafeInteger) {
        return legionInvokeOvmExport(nyarPath, exportName, args);
    }
    // 含超安全整数：绕过包装层，直接把裸数字文本注入 argsJson，serde 按 as_i64 精确还原。
    if (cachedNative === undefined) {
        cachedNative = loadOvmNative();
    }
    if (!cachedNative) {
        throw new Error('ovm 实参含超安全整数的十进制字符串，但平台 valkyrie-napi 绑定不可用，无法精确注入');
    }
    const argsJson = `[${Object.values(args).map(serializeOvmArg).join(',')}]`;
    return JSON.parse(cachedNative.legionInvokeOvmExport(nyarPath, exportName, argsJson)) as unknown;
}

function emitStats(stats: SolverCaseStats): void {
    console.log(formatSolverResultLine(stats));
}

/** 没有可执行期望的哨兵语料；不计入 pass/fail 分母。 */
const NO_EXECUTABLE_EXPECTATION = 'Execution timed out';

function isNoExecutableExpectation(testCase: { expected: unknown }): boolean {
    return typeof testCase.expected === 'string' && testCase.expected === NO_EXECUTABLE_EXPECTATION;
}

async function main(): Promise<number> {
    const problemDir = process.argv[2];
    if (!problemDir) {
        console.error('usage: run_nyar_solver.ts <problem-dir>');
        return 2;
    }

    const meta = JSON.parse(readFileSync(join(problemDir, 'metadata.json'), 'utf8')) as { id?: string };
    const slug = meta.id;
    if (!slug) {
        throw new Error('metadata.id 缺失');
    }

    const problem = { id: slug };
    const projectDir = valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);

    let artifacts: NyarVmArtifacts | null = null;
    const pinned = readNyarExecutionPinFromEnv();
    if (pinned) {
        const freshness = isArtifactCacheFresh(pinned.artifactDir, pinned.compileTarget);
        if (!freshness.fresh) {
            throw new Error(freshness.reason ?? 'pinned execution manifest stale');
        }
        artifacts = {
            outDir: pinned.artifactDir,
            nyarPath: pinned.nyarPath,
            physicalEntry: pinned.physicalEntry,
            logicalEntry: pinned.logicalEntry,
        };
    } else {
        const plan = resolveLaneTargetPlan(projectDir, NYAR_BUILD_TARGET);
        const buildOutcome = ensureNyarBuild(problem, plan);
        if (buildOutcome.error) {
            throw new Error(buildOutcome.error);
        }
        artifacts = resolveNyarBuildArtifacts(problem);
    }
    if (!artifacts) {
        throw new Error('legion build --target ovm 未产出 `.nyar` 入口');
    }

    const { tests, invoke } = loadMetadata(problemDir);
    const problemId = problemIdFromDir(problemDir);
    const compareMode = compareModeForExecution(problemId);
    const entry = invoke.valkyrie ?? invoke.typescript;
    if (!entry) {
        throw new Error('metadata.invoke 缺失');
    }
    const exportName = resolveWasmExportSymbol(entry);
    const blocked = nyarInvokeBlockedReason(artifacts.nyarPath, entry);
    if (blocked) {
        throw new Error(blocked);
    }

    const skipped = tests.filter(isNoExecutableExpectation).length;
    const executableCases = tests
        .map((testCase, index) => ({ testCase, index }))
        .filter(({ testCase }) => !isNoExecutableExpectation(testCase));

    let pass = 0;
    for (const { testCase: case_, index } of executableCases) {
        try {
            if (typeof case_.expected === 'string' && case_.expected.startsWith('Error:')) {
                assertTestCase(index, case_.expected, () => {
                    void runNyarExport(artifacts.nyarPath, exportName, case_.args);
                });
            } else {
                const actual = normalizeTsTestResult(runNyarExport(artifacts.nyarPath, exportName, case_.args));
                const expected = normalizeTsTestResult(case_.expected);
                // 题面允许任意顺序/集合比较时，按规范化形态比较；否则保持精确比较（含整数文本特判）。
                if (compareMode !== 'strict') {
                    if (!resultsMatch(actual, expected, compareMode)) {
                        throw new Error(
                            `tests[${index}]: expected ${formatValue(expected)}, got ${formatValue(actual)}（compareMode=${compareMode}）`,
                        );
                    }
                } else if (isUnsafeIntegerLiteralString(expected) && (typeof actual === 'number' || typeof actual === 'bigint')) {
                    const cmp = compareIntegerResult(actual, expected);
                    if (cmp !== true) {
                        throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
                    }
                } else if (JSON.stringify(actual) !== JSON.stringify(expected)) {
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
                blocked: infrastructureBlocked ? tests.length - skipped - pass : 0,
                not_run: infrastructureBlocked ? 0 : tests.length - skipped - pass - 1,
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
        testCaseTotal: tests.length,
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
