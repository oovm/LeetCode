/**
 * `native-dll` lane 的真实 C ABI 执行。
 *
 * 与 `native` lane（`--target node` 的 Node-API addon）同源不同目标：本 lane 用
 * 显式平台三元组 `x86_64-pc-windows-msvc` 构建普通共享库（`artifact: "library"`），
 * 由独立 C 消费者（`tools/dll-consumer.ts`，经 bun:ffi `dlopen`）按冻结签名装载和调用。
 *
 * 四段证据逐题保留：**build → load → execute → strict**。
 * - `build`：`legion build --target x86_64-pc-windows-msvc` 是否产出库产物；
 * - `load`：清单 `library_exports` 是否声明单一 `c-abi` 物理产物，且消费者能 `dlopen`；
 * - `execute`：至少一条用例真实进入 C 调用并拿到返回；
 * - `strict`：全部可执行用例执行且断言相符，无跳过、无阻塞。
 *
 * 入口身份**严格消费清单**：题目声明的逻辑入口必须与 `c-abi` 公开名逐字匹配且唯一。
 * 编译器的 C ABI 命名合同规定公开名等于源码名，因此清单里两者不一致本身就是合同破坏；
 * 本模块不做大小写换算、不做「只有一个导出就调用」的回退，防止错误导出跑成假绿。
 *
 * 未定案的载体在写出前识别并如实记录首个失败阶段：数组/文本/布尔/浮点实参与返回、
 * guest 异常通道，在 C ABI 合同冻结之前一律记 `ABI：C ABI …载体未定案`，
 * 不猜值、不把宿主承载限制伪装成断言失败。
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { readExecutionManifest } from '@nyar/valkyrie';

import { CONFORMANCE_ROOT } from '../../domain/paths.ts';
import {
    I64_MAX,
    I64_MIN,
    compareIntegerResult,
    isIntegerLiteralString,
    parseIntegerLiteral,
} from '../../domain/integer-literal.ts';
import {
    emptySolverCaseStats,
    extractTestFailureIndex,
    type SolverCaseStats,
} from '../shared/solver-case-stats.ts';
import { loadMetadata, loadTestCases, requireValkyrieInvokeEntry, type TestCase } from '../valkyrie-node/ref.ts';

/** 本 lane 的显式编译目标：Win64 普通共享库（C ABI）。 */
export const DLL_LANE_TARGET = 'x86_64-pc-windows-msvc';

/**
 * 代表题集：Node 与 DLL 两边都能表达的纯 `i64` 标量题（代表题首轮）。
 *
 * 入选条件（全部由清单与源码事实决定，不靠人工筛选印象）：
 * - 公开接口只有 `i64` 标量实参与 `i64` 标量返回，Node lane 已全绿；
 * - 题目声明的逻辑入口与源码声明名逐字相同（导出名不含下划线），
 *   因此 C ABI 公开名与题目入口无需任何命名换算即可唯一匹配。
 *
 * `android-unlock-patterns` 的函数体内部使用集合，公开接口仍是
 * `(i64, i64) -> i64`：它证明「内部集合、外部标量」在两条目标上都成立，
 * 而不是只测无状态算术。
 *
 * 现行题库里多数题目的 `invoke.valkyrie` 仍是 Node 侧 camelCase 名
 * （如 `mySqrt` 对源码 `my_sqrt`）。这些题在 C ABI 侧没有逐字匹配的导出，
 * 会如实记 `identity` 阶段失败，直到题库把稳定导出身份迁到源码名。
 */
export const DLL_REPRESENTATIVE_IDS: readonly string[] = [
    'reverse-integer',
    'divide-two-integers',
    'ugly-number-ii',
    'android-unlock-patterns',
] as const;

/** 清单里声明的一条 `c-abi` 导出。 */
export type DllExportDeclaration = {
    sourceName: string;
    logicalName: string;
    physicalArtifact: string;
    abi: string;
};

/** 本 lane 的产物：单一 `.dll` 与清单声明的导出面。 */
export type DllArtifact = {
    dllPath: string;
    exports: DllExportDeclaration[];
};

/** 产物解析失败的结构化阶段：物理产物不可用记 `load`，导出身份破坏记 `identity`。 */
export type DllResolution = {
    artifact: DllArtifact | null;
    stage: 'load' | 'identity' | null;
    blocker: string | null;
};

/** 泄漏到矩阵的首个失败阶段（四段证据 + 断言）。 */
export type DllFailureStage = 'build' | 'load' | 'symbol' | 'identity' | 'abi' | 'execute' | 'assert';

export type DllRunOutcome = {
    /** 严格通过：全部可执行用例真实执行且断言相符。 */
    ok: boolean;
    /** 至少一条用例的 `dlopen` 成功（消费者返回了结构化结果）。 */
    loaded: boolean;
    /** 至少一条用例真实进入 C 调用。 */
    executed: boolean;
    error: string | null;
    firstFailureStage: DllFailureStage | null;
    /** 首个真实调用的消费者命令，供报告记录“命令 + 退出码”。 */
    command: string | null;
    exitStatus: number | null;
    caseStats: SolverCaseStats;
};

/** 入口身份合同破坏：逻辑入口与 C ABI 公开名不一致、缺失或重复。 */
export class DllIdentityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DllIdentityError';
    }
}

/**
 * 从产物目录解析 DLL 与导出面。
 *
 * 只接受 `artifact_kind === 'library'`、全部导出 `abi === 'c-abi'`、且指向同一个
 * `.dll` 的清单。`c-abi` 的公开名必须等于源码名（编译器 C ABI 命名合同）；
 * 任何不一致都在这里结构化失败，不进入装载。
 */
export function resolveDllArtifact(artifactDir: string): DllResolution {
    let manifest: ReturnType<typeof readExecutionManifest>;
    try {
        manifest = readExecutionManifest(artifactDir);
    }
    catch (error) {
        return { artifact: null, stage: 'load', blocker: `读取执行清单失败：${String(error)}` };
    }
    if (manifest === null) {
        return { artifact: null, stage: 'load', blocker: '缺少执行清单（run-contracts.txt）' };
    }
    if (manifest.artifact_kind !== 'library') {
        return { artifact: null, stage: 'load', blocker: `产物种类 ${manifest.artifact_kind} 不是 library` };
    }
    const entries = manifest.library_exports
        .map((entry) => ({
            sourceName: entry.source_name,
            logicalName: entry.logical_name,
            physicalArtifact: entry.physical_artifact,
            abi: entry.abi,
        }))
        .filter((entry) => entry.logicalName.length > 0 && entry.physicalArtifact.length > 0);
    if (entries.length === 0) {
        return { artifact: null, stage: 'identity', blocker: '执行清单没有可用的库导出（library_exports 为空）' };
    }
    const nonCAbi = entries.filter((entry) => entry.abi !== 'c-abi');
    if (nonCAbi.length > 0) {
        return {
            artifact: null,
            stage: 'identity',
            blocker: `清单导出 ABI 不是 c-abi：${nonCAbi.map((entry) => `${entry.logicalName}=${entry.abi || '(空)'}`).join(', ')}`,
        };
    }
    const renamed = entries.filter((entry) => entry.sourceName.length > 0 && entry.logicalName !== entry.sourceName);
    if (renamed.length > 0) {
        return {
            artifact: null,
            stage: 'identity',
            blocker: `C ABI 公开名与源码名不一致：${renamed.map((entry) => `${entry.sourceName}≠${entry.logicalName}`).join(', ')}`,
        };
    }
    const artifacts = [...new Set(entries.map((entry) => entry.physicalArtifact))];
    if (artifacts.length !== 1) {
        return { artifact: null, stage: 'load', blocker: `库导出指向多个物理产物：${artifacts.join(', ')}` };
    }
    const [physicalArtifact] = artifacts as [string];
    if (!physicalArtifact.endsWith('.dll')) {
        return { artifact: null, stage: 'load', blocker: `物理产物 ${physicalArtifact} 不是 .dll` };
    }
    const dllPath = join(artifactDir, physicalArtifact);
    if (!existsSync(dllPath)) {
        return { artifact: null, stage: 'load', blocker: `物理产物不存在：${physicalArtifact}` };
    }
    return { artifact: { dllPath, exports: entries }, stage: null, blocker: null };
}

/**
 * 按清单导出表确定本次调用符号（严格消费）。
 *
 * 逻辑入口按清单记录的**稳定导出身份**（`source_name`）或**目标公开名**
 * （`logical_name`）逐字精确匹配，且全表只能命中一条；没有大小写/符号启发式
 * 换算，也没有「只有一个导出就调用」的回退。多条命中视为清单破坏，
 * 零命中给出入口与公开名不一致的结构化身份诊断。
 */
export function resolveDllExportName(exports: readonly DllExportDeclaration[], invoke: unknown): string {
    const entry = requireValkyrieInvokeEntry(invoke);
    const matched = exports.filter((candidate) => candidate.logicalName === entry || candidate.sourceName === entry);
    if (matched.length > 1) {
        throw new DllIdentityError(`产物清单重复声明同一导出身份 ${entry}`);
    }
    if (matched.length === 1) {
        return matched[0]!.logicalName;
    }
    throw new DllIdentityError(
        `身份：入口 ${entry} 与 C ABI 公开名不一致（清单导出 ${exports.map((candidate) => `${candidate.sourceName}→${candidate.logicalName}`).join(', ') || '空'}）`,
    );
}

/**
 * 判断一条用例能否进入当前 C ABI 合同；不能时给出载体缺口原因。
 *
 * 已定案的只有 `i64` 标量实参与 `i64` 标量返回。其余载体（数组、文本、布尔、
 * 浮点、对象、原地写回的空期望、guest 异常通道）一律返回结构化原因。
 */
export function dllCarrierBlocker(rawValues: readonly unknown[], expected: unknown, expectsGuestError: boolean): string | null {
    if (expectsGuestError) {
        return 'C ABI 异常通道';
    }
    for (const [position, value] of rawValues.entries()) {
        const reason = dllScalarBlocker(value);
        if (reason !== null) {
            return `实参[${position}] ${reason}`;
        }
    }
    if (expected === null) {
        return '原地写回（空期望）';
    }
    const expectedBlocker = dllScalarBlocker(expected);
    return expectedBlocker === null ? null : `返回${expectedBlocker}`;
}

function dllScalarBlocker(value: unknown): string | null {
    if (typeof value === 'number') {
        return Number.isSafeInteger(value) ? null : '浮点载体（C ABI 只定案 i64 标量）';
    }
    if (typeof value === 'bigint') {
        return value >= I64_MIN && value <= I64_MAX ? null : '整数超出 i64 域';
    }
    if (typeof value === 'boolean') {
        return '布尔载体';
    }
    if (typeof value === 'string') {
        if (!isIntegerLiteralString(value)) {
            return '文本载体';
        }
        const parsed = parseIntegerLiteral(value);
        return parsed !== null && parsed >= I64_MIN && parsed <= I64_MAX ? null : '整数超出 i64 域';
    }
    if (Array.isArray(value)) {
        return '数组载体';
    }
    return '对象载体';
}

/** 把标量实参编码成消费者信封里的形态：安全整数用 number，其余用十进制字符串。 */
function encodeDllScalar(value: unknown): number | string {
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (isIntegerLiteralString(value)) {
        return value;
    }
    throw new Error(`内部错误：${JSON.stringify(value)} 未通过 C ABI 标量检查`);
}

function quoteForCommand(argument: string): string {
    return /\s/.test(argument) ? `"${argument}"` : argument;
}

/** 消费者运行环境：bun 可执行文件与 `tools/dll-consumer.ts`。缺失即本 lane 不可用。 */
export type DllConsumerRuntime = {
    bunPath: string;
    consumerPath: string;
};

/**
 * 解析 DLL 消费者运行环境。
 *
 * `BUN_BIN` 显式指定优先（不存在即失败，不静默回退）；当前进程本身由 bun 启动时
 * 直接用 `process.execPath`；否则取项目内 `node_modules/bun` 的真实可执行文件。
 */
export function resolveDllConsumerRuntime(): DllConsumerRuntime | null {
    const consumerPath = join(CONFORMANCE_ROOT, 'tools', 'dll-consumer.ts');
    if (!existsSync(consumerPath)) {
        return null;
    }
    const bunPath = resolveBunExecutable();
    if (bunPath === null) {
        return null;
    }
    return { bunPath, consumerPath };
}

function resolveBunExecutable(): string | null {
    const override = process.env.BUN_BIN?.trim();
    if (override !== undefined && override.length > 0) {
        return existsSync(override) ? override : null;
    }
    if (process.versions.bun !== undefined) {
        return process.execPath;
    }
    const local = join(CONFORMANCE_ROOT, 'node_modules', 'bun', 'bin', process.platform === 'win32' ? 'bun.exe' : 'bun');
    return existsSync(local) ? local : null;
}

const DLL_CASE_TIMEOUT_MILLISECONDS = 30_000;

/** 没有可执行期望的哨兵语料（与 native lane 同口径）。 */
const NO_EXECUTABLE_EXPECTATION = 'Execution timed out';

/**
 * 对本次库产物执行全量 `<slug>.cases.ts`。
 *
 * 首个失败即中止：真实断言不符记 `assert`，载体缺口记 `abi`，消费者结构化失败
 * 按 `load` / `symbol` / `execute` 归类；已在失败前通过的用例如实计数。
 */
export function runDllReference(
    problemRoot: string,
    artifact: DllArtifact,
    runtime: DllConsumerRuntime,
    target: string,
): DllRunOutcome {
    let firstCommand: string | null = null;
    let loaded = false;
    let executed = false;
    try {
        const snapshot = loadTestCases(problemRoot);
        const { invoke } = loadMetadata(problemRoot);
        const symbol = resolveDllExportName(artifact.exports, invoke);

        let pass = 0;
        let skippedTimeout = 0;
        const executable = snapshot.executableEntries;
        for (const [position, snapshotEntry] of executable.entries()) {
            const index = snapshotEntry.sourceIndex;
            const testCase = snapshotEntry.case as TestCase;
            if (testCase.expected === NO_EXECUTABLE_EXPECTATION) {
                skippedTimeout += 1;
                continue;
            }
            const expectsGuestError = typeof testCase.expected === 'string' && testCase.expected.startsWith('Error:');
            const rawValues = Object.values(testCase.args);
            const blocker = dllCarrierBlocker(rawValues, testCase.expected, expectsGuestError);
            const remaining = executable.length - position - 1;
            if (blocker !== null) {
                const message = `tests[${index}]: ABI：C ABI ${blocker}未定案（target=${target}）`;
                return blockedDllOutcome(message, 'abi', snapshot, pass, skippedTimeout, remaining, firstCommand, null, loaded, executed);
            }

            const payload = {
                dllPath: artifact.dllPath,
                symbol,
                args: rawValues.map(encodeDllScalar),
                returns: 'i64',
            };
            const payloadJson = JSON.stringify(payload);
            const command = [runtime.bunPath, runtime.consumerPath, payloadJson].map(quoteForCommand).join(' ');
            if (firstCommand === null) {
                firstCommand = command;
            }
            const spawned = spawnSync(runtime.bunPath, [runtime.consumerPath, payloadJson], {
                encoding: 'utf8',
                timeout: DLL_CASE_TIMEOUT_MILLISECONDS,
                windowsHide: true,
            });
            if (spawned.error) {
                return blockedDllOutcome(
                    `tests[${index}] 消费者启动失败: ${String(spawned.error)}（${command}）`,
                    'execute',
                    snapshot,
                    pass,
                    skippedTimeout,
                    remaining,
                    firstCommand,
                    spawned.status,
                    loaded,
                    executed,
                );
            }
            const envelope = parseConsumerEnvelope(spawned.stdout);
            if (envelope === null) {
                // 没有结构化信封：guest 崩溃或消费者自身异常退出，装载/调用不可区分。
                const detail = spawned.signal !== null
                    ? `进程被信号 ${spawned.signal} 终止`
                    : `退出码 ${String(spawned.status)}（stderr: ${spawned.stderr.trim() || '(empty)'}）`;
                return blockedDllOutcome(
                    `tests[${index}] C 调用中断，装载与调用阶段不可区分：${detail}（${command}）`,
                    'execute',
                    snapshot,
                    pass,
                    skippedTimeout,
                    remaining,
                    firstCommand,
                    spawned.status,
                    loaded,
                    executed,
                );
            }
            if (!envelope.ok) {
                const stage = consumerStageToFailureStage(envelope.stage);
                if (stage === 'execute') {
                    loaded = true;
                    executed = true;
                }
                else if (stage === 'abi') {
                    // 消费者侧编组失败：没进 dlopen，也没进 guest。
                    loaded = false;
                }
                return blockedDllOutcome(
                    `tests[${index}] C ABI ${envelope.stage} 阶段失败：${envelope.error}（${command}）`,
                    stage,
                    snapshot,
                    pass,
                    skippedTimeout,
                    remaining,
                    firstCommand,
                    spawned.status,
                    loaded,
                    executed,
                );
            }
            loaded = true;
            executed = true;
            const matches = compareIntegerResult(envelope.result, testCase.expected) ?? JSON.stringify(envelope.result) === JSON.stringify(testCase.expected);
            if (!matches) {
                const message = `tests[${index}]: expected ${JSON.stringify(testCase.expected)}, got ${envelope.result}（${command}）`;
                return {
                    ok: false,
                    loaded,
                    executed,
                    error: message,
                    firstFailureStage: 'assert',
                    command: firstCommand,
                    exitStatus: spawned.status,
                    caseStats: {
                        ...emptySolverCaseStats(message),
                        testCaseTotal: snapshot.entries.length,
                        executed_pass: pass,
                        executed_fail: 1,
                        not_run: remaining,
                        skipped: skippedTimeout + snapshot.excludedEntries.length,
                        skipped_timeout: skippedTimeout,
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
            loaded,
            executed,
            error: null,
            firstFailureStage: null,
            command: firstCommand,
            exitStatus: pass > 0 ? 0 : null,
            caseStats: {
                ok: true,
                testCaseTotal: snapshot.entries.length,
                executed_pass: pass,
                executed_fail: 0,
                blocked: 0,
                not_run: 0,
                skipped: skippedTimeout + snapshot.excludedEntries.length,
                skipped_timeout: skippedTimeout,
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
        const stage: DllFailureStage = error instanceof DllIdentityError ? 'identity' : 'execute';
        return {
            ok: false,
            loaded,
            executed,
            error: message,
            firstFailureStage: stage,
            command: firstCommand,
            exitStatus: null,
            caseStats: emptySolverCaseStats(message),
        };
    }
}

type ConsumerEnvelope =
    | { ok: true; result: string }
    | { ok: false; stage: 'abi' | 'load' | 'symbol' | 'call'; error: string };

/** 解析消费者 JSON 信封；缺失或形状不符返回 `null`（按进程崩溃/消费者错误处理）。 */
function parseConsumerEnvelope(stdout: string): ConsumerEnvelope | null {
    try {
        const parsed = JSON.parse(stdout) as Record<string, unknown>;
        if (parsed.ok === true && typeof parsed.result === 'string') {
            return { ok: true, result: parsed.result };
        }
        if (
            parsed.ok === false
            && (parsed.stage === 'abi' || parsed.stage === 'load' || parsed.stage === 'symbol' || parsed.stage === 'call')
            && typeof parsed.error === 'string'
        ) {
            return { ok: false, stage: parsed.stage, error: parsed.error };
        }
        return null;
    }
    catch {
        return null;
    }
}

/** 消费者阶段 → 矩阵阶段：`call` 是「装载成功、调用失败」。 */
export function consumerStageToFailureStage(stage: 'abi' | 'load' | 'symbol' | 'call'): DllFailureStage {
    return stage === 'call' ? 'execute' : stage;
}

function blockedDllOutcome(
    message: string,
    stage: DllFailureStage,
    snapshot: ReturnType<typeof loadTestCases>,
    pass: number,
    skippedTimeout: number,
    remaining: number,
    command: string | null,
    exitStatus: number | null,
    loaded: boolean,
    executed: boolean,
): DllRunOutcome {
    return {
        ok: false,
        loaded,
        executed,
        error: message,
        firstFailureStage: stage,
        command,
        exitStatus,
        caseStats: {
            ...emptySolverCaseStats(message),
            testCaseTotal: snapshot.entries.length,
            executed_pass: pass,
            blocked: 1,
            not_run: remaining,
            skipped: skippedTimeout + snapshot.excludedEntries.length,
            skipped_timeout: skippedTimeout,
            skipped_corpus_defect: snapshot.excludedEntries.length,
            casesSource: snapshot.source,
            casesDigest: snapshot.sourceDigest,
            firstFailureIndex: extractTestFailureIndex(message),
            firstFailure: message,
        },
    };
}
