/**
 * `native` lane 的真实机器码执行。
 *
 * 产物是 `legion build --target node` 生成的 Node-API 原生 addon（x86-64 冻结集），
 * 每个 `<slug>.cases.ts` 用例在独立 Node 子进程里 `require` addon、调用
 * `metadata.invoke.valkyrie` 对应的导出，取 JSON 返回值并比对。
 *
 * 原生 ABI 承载 `i64`（JS `bigint`）、布尔与 `[i64]` 整数数组：数组按元素编组、
 * 调用后写回，因此原地修改语义可以如实比对。`i64` 实参与返回值共用 bigint 载体，
 * 53 位以上整数不经过 JS `number`，可以与精确十进制期望逐位比较。字符串、对象
 * 仍无法送进 addon，逐例记 `skipped`（不进 pass/fail 分母），绝不猜值或伪造通过。
 *
 * 模块与导出身份取自执行清单的正式读取接口（`@nyar/valkyrie` 的
 * `readExecutionManifest`，Rust 侧 `execution::read_manifest`），不扫描目录、
 * 不复用 Wasm 导出名规则猜入口，也不在 TS 侧正则解析清单文本。
 *
 * guest 异常按四类结构化记录：宿主参数错误（addon 抛 `TypeError` / `RangeError`）、
 * guest 失败（guest 抛错经 glue 变成 Node 异常）、运行器错误（缺导出 / 启动失败 /
 * 未预期退出码）、进程崩溃（信号或 NTSTATUS 崩溃码）。当前 guest panic 多表现为
 * 进程崩溃，不冒充可通过的 `Error:` 期望。
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { readExecutionManifest } from '@nyar/valkyrie';

import { compareModeForExecution, resultsMatch } from '../../domain/compare-mode.ts';
import {
    I64_MAX,
    I64_MIN,
    compareIntegerResult,
    isIntegerLiteralString,
    isUnsafeIntegerLiteralString,
    parseIntegerLiteral,
} from '../../domain/integer-literal.ts';
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
    type TestCase,
} from '../valkyrie-node/ref.ts';

/**
 * 原生调用失败的四个结构化类别。
 *
 * - `host-argument-error`：addon 在编组阶段拒绝实参（`TypeError` / `RangeError`）；
 * - `guest-failure`：guest 抛错经 glue 还原成 Node 异常；
 * - `runner-error`：运行器自身或 addon 装载/导出身份问题；
 * - `process-crash`：guest panic 等导致子进程被信号或 NTSTATUS 崩溃码终止。
 */
export type NativeFailureKind = 'host-argument-error' | 'guest-failure' | 'runner-error' | 'process-crash';

export type NativeRunOutcome = {
    ok: boolean;
    error: string | null;
    /** 首个用例的真实启动命令，供报告记录“命令 + 退出码”。 */
    command: string | null;
    exitStatus: number | null;
    /** 本次失败的结构化类别；成功或仅断言不符时为 `null`。 */
    failureKind: NativeFailureKind | null;
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

type ManifestLibraryExportEntry = { logical_name: string; physical_artifact: string };

/**
 * 从执行清单读取模块与导出。
 *
 * 原生 lane 不再扫描目录里的 `.node`，也不复用 Wasm 导出名规则猜入口：
 * 清单的 `library_exports` 是编译产物对宿主承诺的唯一导出表，物理模块由
 * `physical_artifact` 指定。读取走 `@nyar/valkyrie` 的类型化接口
 * （Rust `execution::read_manifest` 的权威投影），不在 TS 侧重写清单格式。
 *
 * 清单缺失、产物种类不是 `library`、导出表为空、导出指向多个物理产物或声明的
 * 模块不存在，一律返回 `null`（结构化阻塞）。
 */
export function resolveNativeArtifact(artifactDir: string): NativeArtifact | null {
    let manifest: ReturnType<typeof readExecutionManifest>;
    try {
        manifest = readExecutionManifest(artifactDir);
    }
    catch {
        return null;
    }
    if (manifest === null || manifest.artifact_kind !== 'library') {
        return null;
    }
    const exports = (manifest.library_exports as ManifestLibraryExportEntry[])
        .map((entry: ManifestLibraryExportEntry) => ({
            logicalName: entry.logical_name,
            physicalArtifact: entry.physical_artifact,
        }))
        .filter((entry) => entry.logicalName.length > 0 && entry.physicalArtifact.length > 0);
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
    return { addonPath, exports: exports.map((entry) => entry.logicalName), artifactKind: manifest.artifact_kind };
}

/**
 * 按清单导出表确定本次调用的导出名（严格消费）。
 *
 * 题目声明的逻辑入口（`metadata.invoke.valkyrie`）必须与清单 `logical_name`
 * （目标公开名，由编译器的目标命名合同投影）**逐字精确匹配且唯一**：
 * - 不做任何大小写/符号启发式换算；
 * - 没有「清单只有一个导出就直接调用」的回退——单导出但入口写错同样失败，
 *   防止把错误的导出跑绿（假绿）；
 * - 清单内重复声明同一公开名也视为合同破坏。
 *
 * 导出供测试直接验证反例。
 */
export function resolveManifestExportName(available: string[], invoke: unknown): string {
    const entry = requireValkyrieInvokeEntry(invoke);
    const matched = available.filter((name) => name === entry);
    if (matched.length === 1) {
        return matched[0]!;
    }
    const reason = matched.length === 0 ? '没有导出与逻辑入口匹配' : '清单重复声明同一公开名';
    throw new Error(`产物清单导出表 (${available.join(', ') || '空'}) 与逻辑入口 ${entry} 不满足唯一匹配：${reason}`);
}

const CASE_TIMEOUT_MILLISECONDS = 30_000;

/** 没有可执行期望的哨兵语料。 */
const NO_EXECUTABLE_EXPECTATION = 'Execution timed out';

/**
 * 子进程脚本：加载 addon、按导出名调用、把返回值编码成 `{ value }`。
 *
 * 退出码约定：3 = 缺少导出（runner-error）；4 = 调用抛错。抛错时 stdout 输出
 * `{ __nativeError: { kind, name, message } }`：`TypeError` / `RangeError` 归为
 * `host-argument-error`（addon 编组阶段拒绝实参），其余归为 `guest-failure`
 * （guest 抛错经 glue 变成 Node 异常）。`bigint` 用 `{ __bigint }` 编码，
 * 避免 JSON 丢精度。
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
    const kind = error instanceof TypeError || error instanceof RangeError ? 'host-argument-error' : 'guest-failure';
    process.stdout.write(JSON.stringify({
        __nativeError: {
            kind,
            name: error && error.name ? String(error.name) : 'Error',
            message: error && error.message ? String(error.message) : String(error),
        },
    }));
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

/** 实参的 JSON 编码：`i64` 统一走 `{ __bigint }`，子进程按 reviver 还原成 BigInt。 */
type NativeBigIntArgument = { __bigint: string };
type NativeArgument = NativeBigIntArgument | boolean | NativeBigIntArgument[];

/**
 * 能被当前 Node-API 原生 addon 承载的实参。
 *
 * 生成的参数桥只接受 JS `bigint`（`napi_get_value_bigint_int64` + `lossless`）、
 * 布尔与整数数组（`[i64]` 按元素编组并写回）；字符串、对象、`null` 与浮点都逐例
 * 跳过，不把宿主类型错误伪装成断言失败。题库把越过 2^53 的整数写成十进制字符串，
 * 这里按 i64 域解析成 BigInt 后送入，保证 >2^53 的实参同样逐位精确。
 */
function nativeArgument(value: unknown): NativeArgument | null {
    const scalar = nativeBigInt(value);
    if (scalar !== null) {
        return scalar;
    }
    if (typeof value === 'boolean') {
        return value;
    }
    if (Array.isArray(value)) {
        const elements: NativeBigIntArgument[] = [];
        for (const element of value) {
            const encoded = nativeBigInt(element);
            if (encoded === null) {
                return null;
            }
            elements.push(encoded);
        }
        return elements;
    }
    return null;
}

/** 把整数形态（number / bigint / 越界十进制字面量）编码成 BigInt 实参；非整数返回 `null`。 */
function nativeBigInt(value: unknown): NativeBigIntArgument | null {
    if (typeof value === 'number') {
        return Number.isSafeInteger(value) ? { __bigint: String(value) } : null;
    }
    if (typeof value === 'bigint') {
        return value >= I64_MIN && value <= I64_MAX ? { __bigint: value.toString() } : null;
    }
    // 生成器只把越过 2^53 的整数写成字符串；安全范围内的数字字符串按普通字符串处理。
    if (isUnsafeIntegerLiteralString(value)) {
        const parsed = parseIntegerLiteral(value);
        return parsed !== null && parsed >= I64_MIN && parsed <= I64_MAX ? { __bigint: parsed.toString() } : null;
    }
    return null;
}

/** 可比较的期望：标量，或（原地修改语义下的）整数数组；bigint 返回不再有 53 位上限。 */
function isExecutableExpectation(expected: unknown): boolean {
    if (Array.isArray(expected)) {
        return expected.every((element) => typeof element === 'number' && Number.isSafeInteger(element));
    }
    return (
        expected === null
        || typeof expected === 'number'
        || typeof expected === 'boolean'
        || typeof expected === 'bigint'
        || isIntegerLiteralString(expected)
    );
}

/**
 * 原地写回题的题面契约 oracle。
 *
 * 语料对这类题只记 `expected: null`（LeetCode 约定：判题比较调用后的数组），
 * 没有逐字期望可比。契约按题面规则从原始实参推导，不猜值：
 * - `move-zeroes`：非零元素相对顺序不变，全部零补在尾部，长度与多重集守恒。
 * 无契约的题维持逐例如实跳过。
 */
function inPlaceContractViolation(problemId: string, original: unknown[], actual: unknown): string | null {
    if (problemId !== 'move-zeroes') {
        return null;
    }
    const source = original[0] as unknown[];
    if (!Array.isArray(actual)) {
        return `调用后数组未按原地写回投影为数组：${JSON.stringify(actual)}`;
    }
    if (actual.length !== source.length) {
        return `长度不守恒：原 ${String(source.length)}，后 ${String(actual.length)}`;
    }
    const toBigInt = (value: unknown): bigint | null => {
        if (typeof value === 'bigint') return value;
        if (typeof value === 'number' && Number.isSafeInteger(value)) return BigInt(value);
        return null;
    };
    const originals = source.map(toBigInt);
    const mutated = actual.map(toBigInt);
    if (originals.some((value) => value === null) || mutated.some((value) => value === null)) {
        return '元素超出整数承载形态，无法核对契约';
    }
    const big = mutated as bigint[];
    const nonZero = big.filter((value) => value !== 0n);
    const expectedNonZero = originals.filter((value) => value !== 0n) as bigint[];
    for (let position = 0; position < expectedNonZero.length; position += 1) {
        if (nonZero[position] !== expectedNonZero[position]) {
            return `非零元素相对顺序被破坏：位置 ${String(position)} 期望 ${String(expectedNonZero[position])}，实际 ${String(nonZero[position])}`;
        }
    }
    for (let position = expectedNonZero.length; position < big.length; position += 1) {
        if (big[position] !== 0n) {
            return `尾部应为零：位置 ${String(position)} 实际 ${String(big[position]!)}`;
        }
    }
    return null;
}

function hasInPlaceContract(problemId: string): boolean {
    return problemId === 'move-zeroes';
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
            // guest 异常期望：仅在实参可编组时真实调用，并按结构化类别匹配；
            // 不能把宿主参数错误或进程崩溃冒充成可通过的 guest 异常。
            const expectsGuestError = typeof testCase.expected === 'string' && testCase.expected.startsWith('Error:');
            const expectedErrorText = expectsGuestError
                ? (testCase.expected as string).slice('Error:'.length).trim()
                : null;
            const rawValues = Object.values(testCase.args);
            // 原地修改题（unit 返回、数组实参）在当前语料里只把 `expected` 记为 null。
            // 有题面契约 oracle 的题真实调用并按契约核对写回结果；无契约的题如实跳过，
            // 不用 null 去否定真实的原地结果。
            const inPlaceOracle = !expectsGuestError
                && testCase.expected === null
                && rawValues.length === 1
                && Array.isArray(rawValues[0])
                && hasInPlaceContract(problemId);
            if (!expectsGuestError && !inPlaceOracle && testCase.expected === null && rawValues.some((rawValue) => Array.isArray(rawValue))) {
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
            if (unsupported || (!expectsGuestError && !isExecutableExpectation(testCase.expected))) {
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
                    'runner-error',
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
                const failure = classifyNativeFailure(spawned.status, spawned.signal, spawned.stdout, spawned.stderr);
                if (expectsGuestError && failure.kind === 'guest-failure') {
                    if (errorMessageMatches(failure.message, expectedErrorText ?? '')) {
                        pass += 1;
                        continue;
                    }
                    const message = `tests[${index}]: 期望 guest 异常 ${JSON.stringify(expectedErrorText)}，实际 ${failure.message}（${command}）`;
                    return assertionFailureOutcome(
                        message,
                        snapshot,
                        pass,
                        skippedTimeout,
                        skippedArgument,
                        remaining,
                        firstCommand,
                        spawned.status,
                    );
                }
                if (expectsGuestError && failure.kind === 'host-argument-error') {
                    // 宿主参数无法无损表达，不能算作 guest 异常验证。
                    skippedArgument += 1;
                    continue;
                }
                return blockedNativeOutcome(
                    `tests[${index}] 原生调用失败 [${failure.kind}] ${failure.message}（${command}）`,
                    failure.kind,
                    snapshot,
                    pass,
                    skippedTimeout,
                    skippedArgument,
                    remaining,
                    firstCommand,
                    spawned.status,
                );
            }
            if (expectsGuestError) {
                const message = `tests[${index}]: 期望 guest 异常 ${JSON.stringify(expectedErrorText)}，但原生调用成功（${command}）`;
                return {
                    ok: false,
                    error: message,
                    command: firstCommand,
                    exitStatus: spawned.status,
                    failureKind: null,
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

            const actual = decodeResult(spawned.stdout);
            if (inPlaceOracle) {
                // 按题面契约核对原地写回：违反契约即断言失败，满足即真实通过。
                const violation = inPlaceContractViolation(problemId, rawValues, actual);
                if (violation !== null) {
                    const message = `tests[${index}]: 原地写回不满足题面契约：${violation}（${command}）`;
                    return assertionFailureOutcome(
                        message,
                        snapshot,
                        pass,
                        skippedTimeout,
                        skippedArgument,
                        remaining,
                        firstCommand,
                        spawned.status,
                    );
                }
                pass += 1;
                continue;
            }
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
                    failureKind: null,
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
            failureKind: null,
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
            failureKind: 'runner-error',
            caseStats: emptySolverCaseStats(message),
        };
    }
}

/** 子进程 stdout 里的结构化异常信封。 */
type NativeErrorEnvelope = {
    kind: 'host-argument-error' | 'guest-failure';
    name: string;
    message: string;
};

function parseNativeError(stdout: string): NativeErrorEnvelope | null {
    try {
        const parsed = JSON.parse(stdout) as { __nativeError?: Partial<NativeErrorEnvelope> };
        const envelope = parsed.__nativeError;
        if (envelope === undefined
            || (envelope.kind !== 'host-argument-error' && envelope.kind !== 'guest-failure')) {
            return null;
        }
        return { kind: envelope.kind, name: String(envelope.name ?? 'Error'), message: String(envelope.message ?? '') };
    }
    catch {
        return null;
    }
}

/**
 * 把子进程退出状态归入四类：宿主参数错误 / guest 失败 / 运行器错误 / 进程崩溃。
 *
 * Windows 上崩溃退出码可能是 NTSTATUS 的 0x8xxxxxxx（spawnSync 可能给出有符号
 * 负数，也可能给出无符号原值），两种形态都按进程崩溃记录。
 */
export function classifyNativeFailure(
    status: number | null,
    signal: NodeJS.Signals | null,
    stdout: string,
    stderr: string,
): { kind: NativeFailureKind; message: string } {
    if (signal !== null) {
        return { kind: 'process-crash', message: `进程被信号 ${signal} 终止` };
    }
    if (status === null) {
        return { kind: 'process-crash', message: '进程无退出码（疑似崩溃）' };
    }
    if (status === 3) {
        return { kind: 'runner-error', message: `native addon 缺少清单声明的导出（stderr: ${stderr.trim() || '(empty)'}）` };
    }
    if (status === 4) {
        const envelope = parseNativeError(stdout);
        if (envelope !== null) {
            return { kind: envelope.kind, message: `${envelope.name}: ${envelope.message}` };
        }
        return { kind: 'guest-failure', message: `guest 调用抛出未分类异常（stderr: ${stderr.trim() || '(empty)'}）` };
    }
    if (status < 0 || status >= 0x80000000) {
        return { kind: 'process-crash', message: `NTSTATUS 崩溃退出码 0x${(status >>> 0).toString(16)}` };
    }
    return { kind: 'runner-error', message: `未预期的原生子进程退出码 ${status}（stderr: ${stderr.trim() || '(empty)'}）` };
}

/** 预期 guest 异常与结构化消息按空白归一后互相包含即匹配。 */
function errorMessageMatches(actual: string, expected: string): boolean {
    const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
    const left = normalize(actual);
    const right = normalize(expected);
    if (left.length === 0 || right.length === 0) {
        return false;
    }
    return left.includes(right) || right.includes(left);
}

/** 已执行用例的断言失败（期望不符）：进 fail 分母，不归为基础设施阻塞。 */
function assertionFailureOutcome(
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
        failureKind: null,
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

/** addon 层阻塞（缺导出 / 调用抛错 / 启动失败）：记 `blocked`，不算断言失败。 */
function blockedNativeOutcome(
    message: string,
    failureKind: NativeFailureKind,
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
        failureKind,
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
