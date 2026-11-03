/**
 * V managed 对照 lane（jvm / clr）解法子进程（仅 Node 宿主）：
 * 入口与调用约定完全来自产物目录的 `managed-abi.json`，每个用例单独起
 * `java -cp <jar>` / `dotnet exec <dll>` 进程，取 stdout 最后一行为返回值，
 * 经同一 NDJSON 协议回给判题进程。
 *
 * 语义与 `adapters/valkyrie-backend/managed-runner.ts` 一致：缺合同、入口缺失、
 * 形参个数/类型不符、进程非零退出都结构化失败，不猜返回值、不跳过用例。
 */
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
    findManagedAbiEntry,
    managedArtifactFileName,
    readManagedAbiContract,
    type ManagedAbiEntry,
    type ManagedContrastLane,
} from '../adapters/valkyrie-backend/managed-abi.ts';
import { resolveWasmExportSymbol } from '../adapters/valkyrie-node/ref.ts';
import { coerceIntegerArgument, I64_MAX, I64_MIN } from '../domain/integer-literal.ts';
import { executeRun } from './child-loops.ts';
import { serveChild } from './child-server.ts';
import type { Candidate } from './ts-entry.ts';

const SUPPORTED_PARAMETER_TYPES = new Set(['i64', 'i32', 'f64', 'bool']);
const CASE_TIMEOUT_MILLISECONDS = 30_000;

/** 把协议值按声明形参类型转成 launcher argv 文本；整数统一按十进制规整（bigint 原文保真）。 */
function formatArgument(value: unknown, parameterType: string, path: string): string {
    switch (parameterType) {
        case 'i64':
        case 'i32': {
            const text = coerceIntegerArgument(value, I64_MIN, I64_MAX, path);
            if (text === null) {
                throw new Error(`${path} 需要整数实参，实际 ${JSON.stringify(value)}`);
            }
            return text;
        }
        case 'f64':
            if (typeof value !== 'number') {
                throw new Error(`${path} 需要数值实参，实际 ${JSON.stringify(value)}`);
            }
            return String(value);
        case 'bool':
            if (typeof value !== 'boolean') {
                throw new Error(`${path} 需要布尔实参，实际 ${JSON.stringify(value)}`);
            }
            return value ? 'true' : 'false';
        default:
            throw new Error(`${path} 的形参类型 \`${parameterType}\` 不是冻结的 managed 标量类型`);
    }
}

/** 解析 launcher stdout 最后一行的返回值；整数保留精确十进制文本，不经 `Number` 损失。 */
function parseManagedReturnValue(stdout: string, returnType: string): unknown {
    const lines = stdout.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
    if (returnType === 'void') {
        return null;
    }
    if (lines.length === 0) {
        throw new Error(`managed 入口返回类型为 \`${returnType}\` 但 stdout 没有输出`);
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
            throw new Error(`managed 布尔返回值无法解析: \`${lastLine}\``);
        case 'i64':
        case 'i32':
            if (!/^-?\d+$/.test(lastLine)) {
                throw new Error(`managed 整数返回值无法解析: \`${lastLine}\``);
            }
            return lastLine;
        case 'f64':
            if (Number.isNaN(Number(lastLine))) {
                throw new Error(`managed 浮点返回值无法解析: \`${lastLine}\``);
            }
            return Number(lastLine);
        default:
            throw new Error(`managed 返回类型 \`${returnType}\` 不受支持`);
    }
}

let candidate: Candidate | null = null;

serveChild(
    async (message) => {
        if (!message.artifactDir) {
            throw new Error('managed lane 的 load 消息缺少 artifactDir');
        }
        if (message.lane !== 'jvm' && message.lane !== 'clr') {
            throw new Error('managed lane 的 load 消息缺少 lane（jvm/clr）');
        }
        const lane: ManagedContrastLane = message.lane;
        const artifactFile = readdirSync(message.artifactDir).find((name) =>
            lane === 'jvm' ? name.endsWith('.jar') : name.endsWith('.dll'),
        );
        if (!artifactFile) {
            throw new Error(`产物目录缺少 ${lane === 'jvm' ? '.jar' : '.dll'} 产物：${message.artifactDir}`);
        }
        const artifactPath = join(message.artifactDir, artifactFile);
        const contract = readManagedAbiContract(message.artifactDir, lane, managedArtifactFileName(artifactPath));
        const entry = findManagedAbiEntry(contract, resolveWasmExportSymbol(message.invoke));
        if (!SUPPORTED_PARAMETER_TYPES.has(entry.return_type) && entry.return_type !== 'void') {
            throw new Error(`managed 入口 \`${entry.logical_entry}\` 返回类型 \`${entry.return_type}\` 不受支持`);
        }
        candidate = (args) => invokeManaged(lane, artifactPath, entry, args);
    },
    async (message) => {
        if (!candidate) {
            throw new Error('尚未 load 解法');
        }
        const outcome = await executeRun(candidate, message);
        return { type: 'done', results: outcome.results, samples: outcome.samples, collectMs: outcome.collectMs };
    },
);

/** managed ABI 没有形参名，按协议 args 键序供货，个数与类型必须完全匹配。 */
function invokeManaged(lane: ManagedContrastLane, artifactPath: string, entry: ManagedAbiEntry, args: Record<string, unknown>): unknown {
    const values = Object.values(args);
    if (values.length !== entry.parameter_types.length) {
        throw new Error(`传参 ${values.length} 个，managed 入口 \`${entry.logical_entry}\` 需要 ${entry.parameter_types.length} 个`);
    }
    const argumentsList = entry.parameter_types.map((parameterType, position) => {
        if (!SUPPORTED_PARAMETER_TYPES.has(parameterType)) {
            throw new Error(`形参 #${position} 类型 \`${parameterType}\` 不受支持`);
        }
        return formatArgument(values[position], parameterType, `形参 #${position}`);
    });
    const binary = lane === 'jvm' ? 'java' : 'dotnet';
    const launchArguments =
        lane === 'jvm'
            ? ['-cp', artifactPath, entry.launcher_class.replaceAll('/', '.'), ...argumentsList]
            : ['exec', artifactPath, entry.logical_entry, ...argumentsList];
    const result = spawnSync(binary, launchArguments, {
        encoding: 'utf8',
        timeout: CASE_TIMEOUT_MILLISECONDS,
        windowsHide: true,
    });
    if (result.error) {
        throw new Error(`启动失败: ${String(result.error)}`);
    }
    if (result.status !== 0) {
        throw new Error(`退出码 ${result.status}: ${(result.stderr ?? '').trim() || '(no stderr)'}`);
    }
    return parseManagedReturnValue(result.stdout ?? '', entry.return_type);
}
