/**
 * `native` lane 的真实机器码执行。
 *
 * 产物是 `legion build --target node` 生成的 Node-API 原生 addon（x86-64 冻结集），
 * 每个 `<slug>.cases.ts` 用例在独立 Node 子进程里 `require` addon、调用
 * `metadata.invoke.valkyrie` 对应的导出，取 JSON 返回值并比对。
 *
 * 原生 ABI 承载整数、布尔与 `[i64]` 整数数组：数组按元素编组、调用后写回，
 * 因此原地修改语义可以如实比对。字符串、对象、BigInt 与抛异常断言仍无法送进
 * addon，逐例记 `skipped`（不进 pass/fail 分母），绝不猜值或伪造通过。
 *
 * 模块与导出身份取自执行清单 `run-contracts.txt` 的 `library_exports`，不扫描目录、
 * 不复用 Wasm 导出名规则猜入口。
 */

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { compareModeForExecution, resultsMatch } from '../../domain/compare-mode.ts';
import { compareIntegerResult, isIntegerLiteralString, isUnsafeIntegerLiteralString } from '../../domain/integer-literal.ts';
import { problemIdFromDir } from '../../domain/metadata.ts';
import {
    emptySolverCaseStats,
    extractTestFailureIndex,
    type SolverCaseStats,
} from '../shared/solver-case-stats.ts';
import {
    loadMetadata,
    loadTestCases,
    requireValkyrieInvokeEntry,
    resolveWasmExportSymbol,
    type TestCase,
} from '../valkyrie-node/ref.ts';

export type NativeRunOutcome = {
    ok: boolean;
    error: string | null;
    /** 首个用例的真实启动命令，供报告记录“命令 + 退出码”。 */
    command: string | null;
    exitStatus: number | null;
    caseStats: SolverCaseStats;
};

/** 原生 addon 产物身份：模块（`.node` 路径）与清单声明的导出名。 */
export type NativeArtifact = {
    /** 执行清单 `library_exports` 指向的物理产物（`.node`）。 */
    addonPath: string;
    /** 清单声明的导出名（`logical_name`，即宿主可调用的 JS 名）。 */
    exports: string[];
    /** 执行清单的产物种类（本 lane 只接受 `library`）。 */
    artifactKind: string;
};

/**
 * 从执行清单 `run-contracts.txt` 读取模块与导出。
 *
 * 原生 lane 不再扫描目录里的 `.node`，也不复用 Wasm 导出名规则猜入口：
 * `library_exports` 是编译产物对宿主承诺的唯一导出表，物理模块由
 * `physical_artifact` 指定。清单缺失、产物种类不是 `library`、导出表为空、
 * 导出指向多个物理产物或声明的模块不存在，一律返回 `null`（结构化阻塞）。
 */
export function resolveNativeArtifact(artifactDir: string): NativeArtifact | null {
    let manifest: string;
    try {
        manifest = readFileSync(join(artifactDir, 'run-contracts.txt'), 'utf8');
    }
    catch {
        return null;
    }
    const artifactKind = /artifact_kind=(\w+)/.exec(manifest)?.[1] ?? null;
    if (artifactKind !== 'library') {
        return null;
    }
    const exports = parseLibraryExports(manifest);
    if (exports.length === 0) {
        return null;
    }
    const artifacts = [...new Set(exports.map((entry) => entry.physicalArtifact))];
    if (artifacts.length !== 1) {
        return null;
    }
    const [physicalArtifact] = artifacts as [string];
    if (!physicalArtifact.endsWith('.node')) {
        return null;
    }
    const addonPath = join(artifactDir, physicalArtifact);
    if (!existsSync(addonPath)) {
        return null;
    }
    return { addonPath, exports: exports.map((entry) => entry.logicalName), artifactKind };
}

/** 解析清单 `library_exports=[...]` 块里的 `logical_name`/`physical_artifact` 对。 */
function parseLibraryExports(manifest: string): { logicalName: string; physicalArtifact: string }[] {
    const block = /library_exports=\[([\s\S]*?)\]\s*,\s*inputs=/.exec(manifest);
    if (block === null) {
        return [];
    }
    const entries: { logicalName: string; physicalArtifact: string }[] = [];
    const entryPattern = /logical_name="([^"]*)"\s*,\s*physical_artifact="([^"]*)"/g;
    for (const match of block[1]!.matchAll(entryPattern)) {
        entries.push({ logicalName: match[1]!, physicalArtifact: match[2]! });
    }
    return entries;
}

/**
 * 按清单导出表确定本次调用的导出名。
 *
 * 清单只有一个导出时直接使用它；多个导出时用元数据 invoke 入口（经既有的
 * camelCase 归一）在清单内定位，绝不接受清单外的名字。
 */
function resolveManifestExportName(available: string[], invoke: unknown): string {
    const preferred = resolveWasmExportSymbol(requireValkyrieInvokeEntry(invoke));
    if (available.includes(preferred)) {
        return preferred;
    }
    if (available.length === 1) {
        return available[0]!;
    }
    throw new Error(`产物清单导出声明的导出 (${available.join(', ')}) 与 invoke 入口 ${preferred} 不匹配`);
}

const CASE_TIMEOUT_MILLISECONDS = 30_000;

/** 没有可执行期望的哨兵语料。 */
const NO_EXECUTABLE_EXPECTATION = 'Execution timed out';

/**
 * 子进程脚本：加载 addon、按导出名调用、把返回值编码成 `{ value }`。
 *
 * 退出码约定：3 = 缺少导出（ABI 阻塞）；4 = 调用抛错（guest trap）。
 * `bigint` 用 `{ __bigint }` 编码，避免 JSON 丢精度。
 */
const NATIVE_CASE_SCRIPT = `
const addon = process.argv[1];
const exportName = process.argv[2];
const module = require(addon);
const fn = module[exportName];
if (typeof fn !== 'function') {
    process.stderr.write('native addon 缺少导出 ' + exportName);
    process.exit(3);
}
const args = JSON.parse(process.argv[3], (_key, value) =>
    value !== null && typeof value === 'object' && typeof value.__bigint === 'string' ? BigInt(value.__bigint) : value);
let result;
try {
    result = fn(...args);
}
catch (error) {
    process.stderr.write(String(error && error.stack ? error.stack : error));
    process.exit(4);
}
// 原生导出以 unit 表示「原地修改实参」：单个数组实参时把调用后的数组作为结果，
// 让题库能比较原地修改的语义，而不是把 undefined 当成返回值。
const value = result === undefined
    ? (args.length === 1 && Array.isArray(args[0]) ? args[0] : null)
    : result;
process.stdout.write(JSON.stringify({ value }, (_key, value) =>
    typeof value === 'bigint' ? { __bigint: value.toString() } : value));
`;

type NativeArgument = number | boolean | number[];

/**
 * 能被当前 Node-API 原生 addon 承载的实参。
 *
 * addon 生成的参数桥接受 JS `number`（`napi_get_value_int64`）、布尔与整数数组
 * （`[i64]` 按元素编组并写回）；`bigint`、字符串、对象、`null` 与浮点都逐例跳过，
 * 不把类型错误伪装成断言失败。超出安全整数范围的数值同样跳过——`napi_get_value_int64`
 * 之前的 JS 语义已经无法保证精确。
 */
function nativeArgument(value: unknown): NativeArgument | null {
    if (typeof value === 'number') {
        return Number.isSafeInteger(value) ? value : null;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (Array.isArray(value)) {
        return value.every((element) => typeof element === 'number' && Number.isSafeInteger(element))
            ? value as number[]
            : null;
    }
    return null;
}

/** 可比较的期望：标量，或（原地修改语义下的）整数数组。 */
function isExecutableExpectation(expected: unknown): boolean {
    // 超出 2^53 的整数返回值经 `napi_create_int64` 会变成不精确的 double，
    // 无法与精确期望比较：逐例跳过，不制造假失败。
    if (isUnsafeIntegerLiteralString(expected)) {
        return false;
    }
    if (Array.isArray(expected)) {
        return expected.every((element) => typeof element === 'number' && Number.isSafeInteger(element));
    }
    return (
        expected === null
        || typeof expected === 'number'
        || typeof expected === 'boolean'
        || isIntegerLiteralString(expected)
    );
}

function encodeArguments(argumentsList: NativeArgument[]): string {
    return JSON.stringify(argumentsList);
}

function decodeResult(stdout: string): unknown {
    const parsed = JSON.parse(stdout, (_key, value) =>
        value !== null && typeof value === 'object' && typeof value.__bigint === 'string'
            ? BigInt(value.__bigint)
            : value) as { value: unknown };
    return parsed.value;
}

function quoteForCommand(argument: string): string {
    return /\s/.test(argument) ? `"${argument}"` : argument;
}

/**
 * 对本次原生 addon 执行全量 `<slug>.cases.ts`。
 *
 * 首个真实断言失败即中止；已在失败前通过的用例如实计数，剩余记 `not_run`。
 * addon 缺失导出或调用抛错按 `blocked` 记（基础设施/guest trap，不算断言失败）。
 */
export function runNativeReference(problemRoot: string, artifact: NativeArtifact): NativeRunOutcome {
    let firstCommand: string | null = null;
    const addonPath = artifact.addonPath;
    try {
        const snapshot = loadTestCases(problemRoot);
        const { invoke } = loadMetadata(problemRoot);
        const problemId = problemIdFromDir(problemRoot);
        const compareMode = compareModeForExecution(problemId);
        const exportName = resolveManifestExportName(artifact.exports, invoke);

        let pass = 0;
        let skippedTimeout = 0;
        let skippedArgument = 0;
        const executable = snapshot.executableEntries;
        for (const [position, snapshotEntry] of executable.entries()) {
            const index = snapshotEntry.sourceIndex;
            const testCase = snapshotEntry.case as TestCase;
            if (testCase.expected === NO_EXECUTABLE_EXPECTATION) {
                skippedTimeout += 1;
                continue;
            }
            if (typeof testCase.expected === 'string' && testCase.expected.startsWith('Error:')) {
                // 原生 addon 还没有异常断言通道：逐例跳过而不是伪造通过。
                skippedArgument += 1;
                continue;
            }
            const rawValues = Object.values(testCase.args);
            // 原地修改题（unit 返回、数组实参）在当前语料里只把 `expected` 记为 null，
            // 没有调用后的数组期望可比较：如实跳过，不用 null 去否定真实的原地结果。
            if (testCase.expected === null && rawValues.some((rawValue) => Array.isArray(rawValue))) {
                skippedArgument += 1;
                continue;
            }
            const argumentsList: NativeArgument[] = [];
            let unsupported = false;
            for (const rawValue of rawValues) {
                const argument = nativeArgument(rawValue);
                if (argument === null) {
                    unsupported = true;
                    break;
                }
                argumentsList.push(argument);
            }
            if (unsupported || !isExecutableExpectation(testCase.expected)) {
                skippedArgument += 1;
                continue;
            }

            const argumentsJson = encodeArguments(argumentsList);
            const command = [process.execPath, addonPath, exportName, argumentsJson]
                .map(quoteForCommand)
                .join(' ');
            if (firstCommand === null) {
                firstCommand = command;
            }
            const spawned = spawnSync(
                process.execPath,
                ['-e', NATIVE_CASE_SCRIPT, addonPath, exportName, argumentsJson],
                { encoding: 'utf8', timeout: CASE_TIMEOUT_MILLISECONDS, windowsHide: true },
            );
            const remaining = executable.length - position - 1;
            if (spawned.error) {
                return blockedNativeOutcome(
                    `tests[${index}] 启动失败: ${String(spawned.error)}（${command}）`,
                    snapshot,
                    pass,
                    skippedTimeout,
                    skippedArgument,
                    remaining,
                    firstCommand,
                    spawned.status,
                );
            }
            if (spawned.status !== 0) {
                return blockedNativeOutcome(
                    `tests[${index}] 原生调用退出码 ${spawned.status}（${command}）: ${spawned.stderr.trim() || '(no stderr)'}`,
                    snapshot,
                    pass,
                    skippedTimeout,
                    skippedArgument,
                    remaining,
                    firstCommand,
                    spawned.status,
                );
            }

            const actual = decodeResult(spawned.stdout);
            const expected = testCase.expected ?? null;
            const matches =
                compareMode !== 'strict'
                    ? resultsMatch(actual, expected, compareMode, { problemId, args: testCase.args })
                    : compareIntegerResult(actual, expected) ?? JSON.stringify(actual) === JSON.stringify(expected);
            if (!matches) {
                const message = `tests[${index}]: expected ${JSON.stringify(expected, (_key, value) => typeof value === 'bigint' ? value.toString() : value)}, got ${JSON.stringify(actual, (_key, value) => typeof value === 'bigint' ? value.toString() : value)}（${command}）`;
                return {
                    ok: false,
                    error: message,
                    command: firstCommand,
                    exitStatus: spawned.status,
                    caseStats: {
                        ...emptySolverCaseStats(message),
                        testCaseTotal: snapshot.entries.length,
                        executed_pass: pass,
                        executed_fail: 1,
                        not_run: remaining,
                        skipped: skippedTimeout + skippedArgument + snapshot.excludedEntries.length,
                        skipped_timeout: skippedTimeout,
                        skipped_integer_argument: skippedArgument,
                        skipped_corpus_defect: snapshot.excludedEntries.length,
                        casesSource: snapshot.source,
                        casesDigest: snapshot.sourceDigest,
                        firstFailureIndex: extractTestFailureIndex(message),
                        firstFailure: message,
                    },
                };
            }
            pass += 1;
        }

        return {
            ok: true,
            error: null,
            command: firstCommand,
            exitStatus: pass > 0 ? 0 : null,
            caseStats: {
                ok: true,
                testCaseTotal: snapshot.entries.length,
                executed_pass: pass,
                executed_fail: 0,
                blocked: 0,
                not_run: 0,
                skipped: skippedTimeout + skippedArgument + snapshot.excludedEntries.length,
                skipped_timeout: skippedTimeout,
                skipped_integer_argument: skippedArgument,
                skipped_corpus_defect: snapshot.excludedEntries.length,
                casesSource: snapshot.source,
                casesDigest: snapshot.sourceDigest,
                firstFailureIndex: null,
                firstFailure: null,
            },
        };
    }
    catch (error) {
        const message = String(error instanceof Error ? error.message : error);
        return {
            ok: false,
            error: message,
            command: firstCommand,
            exitStatus: null,
            caseStats: emptySolverCaseStats(message),
        };
    }
}

/** addon 层阻塞（缺导出 / 调用抛错 / 启动失败）：记 `blocked`，不算断言失败。 */
function blockedNativeOutcome(
    message: string,
    snapshot: ReturnType<typeof loadTestCases>,
    pass: number,
    skippedTimeout: number,
    skippedArgument: number,
    remaining: number,
    command: string | null,
    exitStatus: number | null,
): NativeRunOutcome {
    return {
        ok: false,
        error: message,
        command,
        exitStatus,
        caseStats: {
            ...emptySolverCaseStats(message),
            testCaseTotal: snapshot.entries.length,
            executed_pass: pass,
            blocked: 1,
            not_run: remaining,
            skipped: skippedTimeout + skippedArgument + snapshot.excludedEntries.length,
            skipped_timeout: skippedTimeout,
            skipped_integer_argument: skippedArgument,
            skipped_corpus_defect: snapshot.excludedEntries.length,
            casesSource: snapshot.source,
            casesDigest: snapshot.sourceDigest,
            firstFailureIndex: extractTestFailureIndex(message),
        },
    };
}
