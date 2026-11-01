/**
 * `jvm` / `clr` 对照 lane 的真实 managed 执行。
 *
 * 入口与调用约定完全来自 `managed-abi.json`：
 * - `jvm`: `java -cp <jar> <launcher_class>`，argv 由 launcher 按形参类型解析；
 * - `clr`: `dotnet exec <dll> <logical_entry>`，`managed_entry` 按逻辑入口分发。
 *
 * 每个 `metadata.tests` 用例单独起进程，取 stdout 最后一行为返回值并比对。
 * 任何缺合同、入口缺失、形参个数/类型不符、进程非零退出都结构化失败，
 * 不猜返回值、不跳过用例。
 */

import { spawnSync } from 'node:child_process';

import { emptySolverCaseStats, extractTestFailureIndex, type SolverCaseStats } from '../shared/solver-case-stats.ts';
import { loadMetadata, requireValkyrieInvokeEntry, resolveWasmExportSymbol, type TestCase } from '../valkyrie-node/ref.ts';
import { findManagedAbiEntry, ManagedAbiError, type ManagedAbiContract, type ManagedAbiEntry, type ManagedContrastLane } from './managed-abi.ts';

export type ManagedRunOutcome = {
    ok: boolean;
    error: string | null;
    /** 首个用例的真实启动命令，供报告记录“命令 + 退出码”。 */
    command: string | null;
    /** 全部用例统一为 0 时记 0；首个非零退出记该值；未执行记 null。 */
    exitStatus: number | null;
    caseStats: SolverCaseStats;
};

const SUPPORTED_PARAMETER_TYPES = new Set(['i64', 'i32', 'f64', 'bool']);
const CASE_TIMEOUT_MILLISECONDS = 30_000;

function quoteForCommand(argument: string): string {
    return /\s/.test(argument) ? `"${argument}"` : argument;
}

function formatCommand(binary: string, argumentsList: string[]): string {
    return [binary, ...argumentsList].map(quoteForCommand).join(' ');
}

/** 把 metadata 值按声明形参类型转成 launcher argv 文本。 */
function formatArgument(value: unknown, parameterType: string, path: string): string {
    switch (parameterType) {
        case 'i64':
        case 'i32':
            if (typeof value !== 'number' || !Number.isInteger(value)) {
                throw new ManagedAbiError(`${path} 需要整数实参，实际 ${JSON.stringify(value)}`);
            }
            // `Number.prototype.toString()` 返回最短可往返十进制，保留 2^53 以上的原始整数文本。
            return value.toString();
        case 'f64':
            if (typeof value !== 'number') {
                throw new ManagedAbiError(`${path} 需要数值实参，实际 ${JSON.stringify(value)}`);
            }
            return String(value);
        case 'bool':
            if (typeof value !== 'boolean') {
                throw new ManagedAbiError(`${path} 需要布尔实参，实际 ${JSON.stringify(value)}`);
            }
            return value ? 'true' : 'false';
        default:
            throw new ManagedAbiError(`${path} 的形参类型 \`${parameterType}\` 不是冻结的 managed 标量类型`);
    }
}

/** 解析 launcher stdout 最后一行的返回值。 */
function parseManagedReturnValue(stdout: string, returnType: string): unknown {
    const lines = stdout.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
    if (returnType === 'void') {
        return null;
    }
    if (lines.length === 0) {
        throw new ManagedAbiError(`managed 入口返回类型为 \`${returnType}\` 但 stdout 没有输出`);
    }
    const lastLine = lines[lines.length - 1] as string;
    switch (returnType) {
        case 'bool':
            if (lastLine === 'true' || lastLine === 'True') {
                return true;
            }
            if (lastLine === 'false' || lastLine === 'False') {
                return false;
            }
            throw new ManagedAbiError(`managed 布尔返回值无法解析: \`${lastLine}\``);
        case 'i64':
        case 'i32':
            if (!/^-?\d+$/.test(lastLine)) {
                throw new ManagedAbiError(`managed 整数返回值无法解析: \`${lastLine}\``);
            }
            return Number(lastLine);
        case 'f64':
            if (Number.isNaN(Number(lastLine))) {
                throw new ManagedAbiError(`managed 浮点返回值无法解析: \`${lastLine}\``);
            }
            return Number(lastLine);
        default:
            throw new ManagedAbiError(`managed 返回类型 \`${returnType}\` 不受支持`);
    }
}

/** 每个用例的 argv：managed ABI 没有形参名，按 metadata 键序供货，个数与类型必须完全匹配。 */
function buildCaseArguments(testCase: TestCase, entry: ManagedAbiEntry, index: number): string[] {
    const values = Object.values(testCase.args);
    if (values.length !== entry.parameter_types.length) {
        throw new ManagedAbiError(
            `tests[${index}] 传参 ${values.length} 个，managed 入口 \`${entry.logical_entry}\` 需要 ${entry.parameter_types.length} 个`,
        );
    }
    return entry.parameter_types.map((parameterType, position) => {
        if (!SUPPORTED_PARAMETER_TYPES.has(parameterType)) {
            throw new ManagedAbiError(`tests[${index}] 形参 #${position} 类型 \`${parameterType}\` 不受支持`);
        }
        return formatArgument(values[position], parameterType, `tests[${index}] 形参 #${position}`);
    });
}

function launchManagedEntry(
    lane: ManagedContrastLane,
    artifactPath: string,
    entry: ManagedAbiEntry,
    argumentsList: string[],
): { status: number | null; stdout: string; stderr: string; command: string; launchError: string | null } {
    const binary = lane === 'jvm' ? 'java' : 'dotnet';
    const launchArguments =
        lane === 'jvm'
            ? ['-cp', artifactPath, entry.launcher_class.replaceAll('/', '.'), ...argumentsList]
            : ['exec', artifactPath, entry.logical_entry, ...argumentsList];
    const command = formatCommand(binary, launchArguments);
    const result = spawnSync(binary, launchArguments, {
        encoding: 'utf8',
        timeout: CASE_TIMEOUT_MILLISECONDS,
        windowsHide: true,
    });
    return {
        status: result.status,
        stdout: result.stdout ?? '',
        stderr: result.stderr ?? '',
        command,
        launchError: result.error ? String(result.error) : null,
    };
}

/**
 * 对本次 managed 产物执行全量 `metadata.tests`。
 *
 * `contract` 必须来自 `readManagedAbiContract`（已校验 digest/artifact/lane）。
 */
export function runManagedReference(
    problemRoot: string,
    lane: ManagedContrastLane,
    artifactPath: string,
    contract: ManagedAbiContract,
): ManagedRunOutcome {
    try {
        const { tests, invoke } = loadMetadata(problemRoot);
        const invokeEntry = requireValkyrieInvokeEntry(invoke);
        const entry = findManagedAbiEntry(contract, resolveWasmExportSymbol(invokeEntry));
        if (!SUPPORTED_PARAMETER_TYPES.has(entry.return_type) && entry.return_type !== 'void') {
            throw new ManagedAbiError(`managed 入口 \`${entry.logical_entry}\` 返回类型 \`${entry.return_type}\` 不受支持`);
        }

        let pass = 0;
        let firstCommand: string | null = null;
        let exitStatus: number | null = null;
        for (const [index, testCase] of tests.entries()) {
            if (typeof testCase.expected === 'string' && testCase.expected.startsWith('Error:')) {
                throw new ManagedAbiError(`tests[${index}] 期待抛出异常，managed 标量 launcher 不支持该断言`);
            }
            const argumentsList = buildCaseArguments(testCase, entry, index);
            const launched = launchManagedEntry(lane, artifactPath, entry, argumentsList);
            if (firstCommand === null) {
                firstCommand = launched.command;
            }
            if (launched.launchError) {
                throw new ManagedAbiError(`tests[${index}] 启动失败: ${launched.launchError}（${launched.command}）`);
            }
            if (launched.status !== 0) {
                throw new ManagedAbiError(
                    `tests[${index}] 退出码 ${launched.status}（${launched.command}）: ${launched.stderr.trim() || '(no stderr)'}`,
                );
            }
            const actual = parseManagedReturnValue(launched.stdout, entry.return_type);
            const expected = testCase.expected ?? null;
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
                throw new ManagedAbiError(
                    `tests[${index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}（${launched.command}）`,
                );
            }
            pass += 1;
            exitStatus = 0;
        }

        return {
            ok: true,
            error: null,
            command: firstCommand,
            exitStatus,
            caseStats: {
                ok: true,
                testCaseTotal: tests.length,
                testCasePass: pass,
                testCaseFail: 0,
                firstFailureIndex: null,
                firstFailure: null,
            },
        };
    } catch (error) {
        const message = error instanceof ManagedAbiError ? error.reason : String(error);
        const failedIndex = extractTestFailureIndex(message);
        return {
            ok: false,
            error: message,
            command: null,
            exitStatus: null,
            caseStats: emptySolverCaseStats(message),
        };
    }
}
