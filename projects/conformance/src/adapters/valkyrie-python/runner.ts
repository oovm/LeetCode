/**
 * `python` lane 的真实 CPython 扩展消费。
 *
 * 产物是 `legion build --target python` 写出的扩展模块；模块名由执行清单
 * `library_exports[].module_name` 冻结（工程名归一化结果，与文件名前缀和
 * `PyInit_` 同源），导出名取清单 `logical_name`（CPython 保留源码名）。
 *
 * 载体合同先于编组：清单必须声明 `abi = "cpython"`、签名完整（`parameters`
 * 与 `parameter_names` 等长、`returns` 非空）、模块名非空且全表一致、物理
 * 产物是单一扩展文件。用例字段按冻结形参名绑定，实参数量与签名不符即阻塞。
 *
 * 子进程消费者（`tools/python-consumer.py`）在投影返回值前断言实际 Python
 * 类型（`i64` 必须 `int` 且非 `bool`、`utf8` 必须 `str` 等），用真实
 * `importlib` 装载模块，不做任何模块名/导出名的大小写换算。
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { readExecutionManifest } from '@nyar/valkyrie';

import { CONFORMANCE_ROOT } from '../../domain/paths.ts';
import { problemIdFromDir } from '../../domain/metadata.ts';
import { parseIntegerLiteral } from '../../domain/integer-literal.ts';
import {
    emptySolverCaseStats,
    extractTestFailureIndex,
    type SolverCaseStats,
} from '../shared/solver-case-stats.ts';
import { loadMetadata, loadTestCases } from '../valkyrie-node/ref.ts';
import { bindNativeArguments, resolveManifestExportName } from '../valkyrie-backend/native-runner.ts';

/** 本 lane 的显式编译目标。 */
export const PYTHON_LANE_TARGET = 'python';

/** 清单声明的一条 CPython 导出。 */
export type PythonExportDeclaration = {
    sourceName: string;
    logicalName: string;
    physicalArtifact: string;
    abi: string;
    parameters: string[];
    parameterNames: string[];
    returns: string;
    moduleName: string;
};

export type PythonArtifact = {
    /** 扩展文件绝对路径（`.pyd` / `.so` / `.dylib`）。 */
    extensionPath: string;
    /** 执行清单冻结的模块名，`import` 与 `PyInit_` 必须同值。 */
    moduleName: string;
    exports: PythonExportDeclaration[];
};

/** 首个失败阶段：编译 / 载体 / 身份 / 装载 / 执行 / 断言。 */
export type PythonFailureStage = 'build' | 'carrier' | 'identity' | 'load' | 'execute' | 'assert' | 'driver';

export type PythonRunOutcome = {
    ok: boolean;
    /** 至少一条用例真实完成 `import` 与模块访问。 */
    loaded: boolean;
    /** 至少一条用例真实进入函数调用。 */
    executed: boolean;
    error: string | null;
    firstFailureStage: PythonFailureStage | null;
    command: string | null;
    exitStatus: number | null;
    caseStats: SolverCaseStats;
};

type ManifestLibraryExportEntry = {
    logical_name?: string;
    source_name?: string;
    physical_artifact?: string;
    abi?: string;
    signature_available?: boolean;
    parameters?: string[];
    parameter_names?: string[];
    returns?: string;
    module_name?: string;
};

const EXTENSION_SUFFIXES = ['.pyd', '.so', '.dylib'] as const;

function expectedInteger(value: unknown): bigint | null {
    if (typeof value === 'bigint') {
        return value;
    }
    if (typeof value === 'number') {
        return Number.isSafeInteger(value) ? BigInt(value) : null;
    }
    if (typeof value === 'string') {
        return parseIntegerLiteral(value);
    }
    return null;
}

function isExtensionFile(path: string): boolean {
    return EXTENSION_SUFFIXES.some((suffix) => path.endsWith(suffix));
}

/**
 * 校验并投影清单导出表：任一条目不满足完整载体合同即整体返回 `null`。
 *
 * 导出供测试直接验证反例（缺模块名 / 缺签名 / 未知 ABI / 形参名不等长）。
 */
export function parsePythonManifestExports(
    entries: ManifestLibraryExportEntry[],
): { exports: PythonExportDeclaration[]; physicalArtifact: string; moduleName: string } | null {
    if (!Array.isArray(entries) || entries.length === 0) {
        return null;
    }
    const exports: PythonExportDeclaration[] = [];
    const names = new Set<string>();
    let physicalArtifact: string | null = null;
    let moduleName: string | null = null;
    for (const entry of entries) {
        if (entry.abi !== 'cpython' || entry.signature_available !== true) {
            return null;
        }
        const logicalName = typeof entry.logical_name === 'string' ? entry.logical_name : '';
        const artifact = typeof entry.physical_artifact === 'string' ? entry.physical_artifact : '';
        const parameters = Array.isArray(entry.parameters) ? entry.parameters : [];
        const parameterNames = Array.isArray(entry.parameter_names) ? entry.parameter_names : [];
        const returns = typeof entry.returns === 'string' ? entry.returns : '';
        const entryModule = typeof entry.module_name === 'string' ? entry.module_name : '';
        if (logicalName.length === 0 || artifact.length === 0 || returns.length === 0 || entryModule.length === 0) {
            return null;
        }
        if (parameters.length !== parameterNames.length) {
            return null;
        }
        if (parameterNames.some((name) => name.length === 0) || new Set(parameterNames).size !== parameterNames.length) {
            return null;
        }
        if (names.has(logicalName) || !isExtensionFile(artifact)) {
            return null;
        }
        if (moduleName !== null && moduleName !== entryModule) {
            return null;
        }
        if (physicalArtifact !== null && physicalArtifact !== artifact) {
            return null;
        }
        moduleName = entryModule;
        physicalArtifact = artifact;
        names.add(logicalName);
        exports.push({
            sourceName: typeof entry.source_name === 'string' ? entry.source_name : logicalName,
            logicalName,
            physicalArtifact: artifact,
            abi: entry.abi,
            parameters,
            parameterNames,
            returns,
            moduleName: entryModule,
        });
    }
    if (physicalArtifact === null || moduleName === null) {
        return null;
    }
    return { exports, physicalArtifact, moduleName };
}

/** 从执行清单解析 CPython 产物；失败返回 `null` 由调用方结构化阻塞。 */
export function resolvePythonArtifact(artifactDir: string): PythonArtifact | null {
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
    const parsed = parsePythonManifestExports(manifest.library_exports as ManifestLibraryExportEntry[]);
    if (parsed === null) {
        return null;
    }
    const extensionPath = join(artifactDir, parsed.physicalArtifact);
    if (!existsSync(extensionPath)) {
        return null;
    }
    return { extensionPath, moduleName: parsed.moduleName, exports: parsed.exports };
}

/** CPython 解释器：默认 PATH 上的 `python`，可用 `LEETCODE_PYTHON` 覆盖。 */
export function resolvePythonRuntime(): string | null {
    const executable = process.env.LEETCODE_PYTHON?.trim() || 'python';
    const probe = spawnSync(executable, ['-c', 'import sys; print(sys.version_info[0], sys.version_info[1])'], {
        encoding: 'utf8',
        timeout: 15_000,
    });
    return probe.status === 0 ? executable : null;
}

export function pythonConsumerPath(): string {
    return join(CONFORMANCE_ROOT, 'tools', 'python-consumer.py');
}

type ConsumerEnvelope = {
    ok?: boolean;
    kind?: string;
    value?: unknown;
    argsAfter?: unknown[];
    exports?: string[];
    stage?: string;
    error?: string;
    errorType?: string;
    called?: boolean;
};

function parseEnvelope(stdout: string): ConsumerEnvelope | null {
    try {
        const parsed = JSON.parse(stdout) as ConsumerEnvelope;
        return typeof parsed === 'object' && parsed !== null ? parsed : null;
    }
    catch {
        return null;
    }
}

/** 按清单返回载体把消费者编码值还原成严格比对用的 JS 值。 */
export function decodePythonResult(envelope: ConsumerEnvelope): unknown {
    const kind = envelope.kind ?? '';
    if (kind === 'i64') {
        if (typeof envelope.value !== 'string' || !/^-?\d+$/.test(envelope.value)) {
            throw new Error(`i64 返回编码不是十进制整数字符串：${JSON.stringify(envelope.value)}`);
        }
        return BigInt(envelope.value);
    }
    if (kind === 'i64[]') {
        if (!Array.isArray(envelope.value)) {
            throw new Error('i64[] 返回编码不是数组');
        }
        return envelope.value.map((item) => {
            if (typeof item !== 'string' || !/^-?\d+$/.test(item)) {
                throw new Error(`i64[] 元素不是十进制整数字符串：${JSON.stringify(item)}`);
            }
            return BigInt(item);
        });
    }
    if (kind === 'f64') {
        if (typeof envelope.value !== 'string') {
            throw new Error('f64 返回编码不是字符串');
        }
        return Number(envelope.value);
    }
    if (kind === 'bool') {
        if (typeof envelope.value !== 'boolean') {
            throw new Error('bool 返回编码不是布尔值');
        }
        return envelope.value;
    }
    if (kind === 'utf8') {
        if (typeof envelope.value !== 'string') {
            throw new Error('utf8 返回编码不是字符串');
        }
        return envelope.value;
    }
    if (kind === 'unit') {
        return null;
    }
    throw new Error(`未知返回载体 ${kind}`);
}

/**
 * 严格比对：载体按清单声明的返回类型逐字比较，不把字符串与整数规整成同值。
 *
 * `i64` 走 bigint 与十进制期望；`utf8` 逐码点比较；`bool` 必须布尔；
 * `unit` 必须 `None`；`i64[]` 逐元素整数。
 */
export function strictPythonMatch(actual: unknown, expected: unknown, returnKind: string): boolean {
    if (returnKind === 'utf8') {
        return typeof actual === 'string' && actual === expected;
    }
    if (returnKind === 'bool') {
        return typeof actual === 'boolean' && actual === expected;
    }
    if (returnKind === 'i64') {
        if (typeof actual !== 'bigint') {
            return false;
        }
        const expectedValue = expectedInteger(expected);
        return expectedValue !== null && actual === expectedValue;
    }
    if (returnKind === 'f64') {
        return typeof actual === 'number' && typeof expected === 'number' && Object.is(actual, expected);
    }
    if (returnKind === 'unit') {
        return actual === null;
    }
    if (returnKind === 'i64[]') {
        if (!Array.isArray(actual) || !Array.isArray(expected) || actual.length !== expected.length) {
            return false;
        }
        for (let index = 0; index < actual.length; index += 1) {
            if (typeof actual[index] !== 'bigint') {
                return false;
            }
            const expectedValue = expectedInteger(expected[index]);
            if (expectedValue === null || actual[index] !== expectedValue) {
                return false;
            }
        }
        return true;
    }
    return false;
}

const CASE_TIMEOUT_MILLISECONDS = 30_000;
const CASE_MAX_BUFFER_BYTES = 64 * 1024 * 1024;
const NO_EXECUTABLE_EXPECTATION = 'Execution timed out';

/**
 * 逐用例真实 `import` 并调用清单声明的导出。
 *
 * 首个断言失败即中止，失败前通过的用例如实计数，剩余记 `not_run`。
 * 装载/身份/ABI/子进程失败按 `blocked` 记录，不伪装成断言失败。
 */
export function runPythonReference(problemRoot: string, artifact: PythonArtifact): PythonRunOutcome {
    const python = resolvePythonRuntime();
    if (python === null) {
        return blockedPythonOutcome('CPython 解释器不可用（PATH 上的 python 或 LEETCODE_PYTHON）', null, 'load');
    }
    const consumerPath = pythonConsumerPath();
    if (!existsSync(consumerPath)) {
        return blockedPythonOutcome('CPython 消费者 tools/python-consumer.py 缺失', null, 'driver');
    }
    const problemId = problemIdFromDir(problemRoot);
    const workDir = join(tmpdir(), 'leetcode-python-cases', problemId);
    let firstCommand: string | null = null;
    try {
        rmSync(workDir, { recursive: true, force: true });
        mkdirSync(workDir, { recursive: true });
        const snapshot = loadTestCases(problemRoot);
        const { invoke } = loadMetadata(problemRoot);
        const exportName = resolveManifestExportName(artifact.exports.map((entry) => entry.logicalName), invoke);
        const signature = artifact.exports.find((entry) => entry.logicalName === exportName);
        if (signature === undefined) {
            throw new Error(`执行清单未提供导出 ${exportName} 的冻结载体签名`);
        }

        let pass = 0;
        let skippedArgument = 0;
        let loaded = false;
        let executed = false;
        const executable = snapshot.executableEntries;
        for (const [position, snapshotEntry] of executable.entries()) {
            const index = snapshotEntry.sourceIndex;
            const testCase = snapshotEntry.case as { args: Record<string, unknown>; expected?: unknown };
            if (testCase.expected === NO_EXECUTABLE_EXPECTATION) {
                skippedArgument += 1;
                continue;
            }
            const expectsGuestError = typeof testCase.expected === 'string' && testCase.expected.startsWith('Error:');
            if (expectsGuestError) {
                // CPython glue 的 guest 异常通道尚未冻结：不能把任何错误冒充成可通过。
                skippedArgument += 1;
                continue;
            }
            const rawValues = bindNativeArguments(testCase.args, signature.parameterNames);
            if (rawValues === null) {
                throw new Error(
                    `tests[${index}] 实参字段 ${JSON.stringify(Object.keys(testCase.args as object))} 与冻结形参 ${JSON.stringify(signature.parameterNames)} 不匹配`,
                );
            }
            const payloadPath = join(workDir, `case-${index}.json`);
            writeFileSync(
                payloadPath,
                JSON.stringify({
                    pydPath: artifact.extensionPath,
                    moduleName: artifact.moduleName,
                    exportName,
                    parameters: signature.parameters,
                    parameterNames: signature.parameterNames,
                    returns: signature.returns,
                    args: rawValues,
                }),
                'utf8',
            );
            const command = `python ${consumerPath} ${payloadPath}`;
            if (firstCommand === null) {
                firstCommand = command;
            }
            const spawned = spawnSync(python, [consumerPath, payloadPath], {
                encoding: 'utf8',
                timeout: CASE_TIMEOUT_MILLISECONDS,
                maxBuffer: CASE_MAX_BUFFER_BYTES,
                windowsHide: true,
            });
            const remaining = executable.length - position - 1;
            if (spawned.error) {
                return blockedPythonOutcome(`tests[${index}] 启动失败: ${String(spawned.error)}（${command}）`, firstCommand, 'driver');
            }
            const envelope = parseEnvelope(spawned.stdout ?? '');
            if (envelope === null) {
                return blockedPythonOutcome(
                    `tests[${index}] 消费者没有返回结构化结果（exit=${spawned.status}）：${(spawned.stderr ?? '').trim().slice(0, 400)}`,
                    firstCommand,
                    'driver',
                );
            }
            if (envelope.stage === 'load') {
                return blockedPythonOutcome(`tests[${index}] CPython 装载失败：${envelope.error ?? '(无详情)'}`, firstCommand, 'load');
            }
            loaded = true;
            if (envelope.ok !== true) {
                const stage = envelope.stage === 'identity' ? 'identity' : envelope.stage === 'abi' ? 'carrier' : 'execute';
                return {
                    ok: false,
                    loaded,
                    executed: envelope.called === true,
                    error: `tests[${index}] CPython 调用失败 [${stage}] ${envelope.error ?? '(无详情)'}（${command}）`,
                    firstFailureStage: stage,
                    command: firstCommand,
                    exitStatus: spawned.status,
                    caseStats: blockedCaseStats(snapshot.entries.length, pass, skippedArgument, remaining, `tests[${index}] CPython 调用失败`),
                };
            }
            executed = true;
            let actual: unknown;
            try {
                actual = decodePythonResult(envelope);
            }
            catch (error) {
                return blockedPythonOutcome(`tests[${index}] ${String(error)}`, firstCommand, 'driver');
            }
            const expected = testCase.expected ?? null;
            if (!strictPythonMatch(actual, expected, signature.returns)) {
                const message = `tests[${index}]: expected ${JSON.stringify(expected)}, got ${renderActual(actual)}（${command}）`;
                return {
                    ok: false,
                    loaded,
                    executed,
                    error: message,
                    firstFailureStage: 'assert',
                    command: firstCommand,
                    exitStatus: spawned.status,
                    caseStats: {
                        ok: false,
                        testCaseTotal: snapshot.entries.length,
                        executed_pass: pass,
                        executed_fail: 1,
                        blocked: 0,
                        not_run: remaining,
                        skipped: skippedArgument + snapshot.excludedEntries.length,
                        skipped_timeout: 0,
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
            ok: pass > 0 && skippedArgument === 0,
            loaded,
            executed,
            error: null,
            firstFailureStage: null,
            command: firstCommand,
            exitStatus: pass > 0 ? 0 : null,
            caseStats: {
                ok: pass > 0 && skippedArgument === 0,
                testCaseTotal: snapshot.entries.length,
                executed_pass: pass,
                executed_fail: 0,
                blocked: 0,
                not_run: 0,
                skipped: skippedArgument + snapshot.excludedEntries.length,
                skipped_timeout: 0,
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
            loaded: false,
            executed: false,
            error: message,
            firstFailureStage: 'driver',
            command: firstCommand,
            exitStatus: null,
            caseStats: emptySolverCaseStats(message),
        };
    }
}

function renderActual(actual: unknown): string {
    return JSON.stringify(actual, (_key, value) => typeof value === 'bigint' ? value.toString() : value);
}

function blockedCaseStats(
    testCaseTotal: number,
    executedPass: number,
    skipped: number,
    notRun: number,
    firstFailure: string,
): SolverCaseStats {
    return {
        ...emptySolverCaseStats(firstFailure),
        testCaseTotal,
        executed_pass: executedPass,
        not_run: notRun,
        skipped,
        skipped_integer_argument: skipped,
        firstFailure,
    };
}

function blockedPythonOutcome(
    error: string,
    command: string | null,
    stage: PythonFailureStage,
): PythonRunOutcome {
    return {
        ok: false,
        loaded: false,
        executed: false,
        error,
        firstFailureStage: stage,
        command,
        exitStatus: null,
        caseStats: emptySolverCaseStats(error),
    };
}
