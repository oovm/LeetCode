/**
 * V wasm 解法子进程入口（仅 Node 宿主）：加载 legion 产物目录里的 glue + wasm，
 * 按 ABI schema 做参数 marshal，经同一 NDJSON 协议与判题进程通信。
 *
 * 产物由独立的 legion build 供给（`--artifact-dir` 经 load 消息传入），
 * 本子进程只做 invoke，不承担编译。
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { loadLibraryInvokeSchema, orderArgsBySchema } from '../adapters/valkyrie-node/abi.ts';
import { resolveWasmExportSymbol } from '../adapters/valkyrie-node/ref.ts';
import { executeRun } from './child-loops.ts';
import { serveChild } from './child-server.ts';
import type { Candidate } from './ts-entry.ts';
import { lookupAbiExport, normalizeResultByAbiType, preserveI64Precision } from './v-shared.ts';
import type { WasmAbiType } from '../adapters/valkyrie-node/abi.ts';

type InvokeHost = {
    invokeLeetCode?: (entry: string, args: Record<string, unknown>) => unknown;
    callExport?: (name: string, ...args: unknown[]) => unknown;
};

let candidate: Candidate | null = null;

function resolveArtifacts(artifactDir: string): { mjsPath: string; wasmPath: string } {
    const files = readdirSync(artifactDir);
    const mjs = files.find((name) => name.endsWith('.mjs'));
    const wasm = files.find((name) => name.endsWith('.wasm'));
    if (!mjs || !wasm) {
        throw new Error(`产物目录缺少 glue/wasm：${artifactDir}`);
    }
    return { mjsPath: join(artifactDir, mjs), wasmPath: join(artifactDir, wasm) };
}

serveChild(
    async (message) => {
        if (!message.artifactDir) {
            throw new Error('valkyrie lane 的 load 消息缺少 artifactDir');
        }
        const { mjsPath, wasmPath } = resolveArtifacts(message.artifactDir);
        const schema = loadLibraryInvokeSchema(readFileSync(wasmPath));
        const lookup = lookupAbiExport(schema, message.invoke, resolveWasmExportSymbol(message.invoke));
        const host = (await import(pathToFileURL(mjsPath).href)) as InvokeHost;
        if (typeof host.callExport !== 'function') {
            throw new Error('node glue 未暴露 callExport，无法 invoke wasm 产物');
        }
        const returns = lookup.exportSchema.returns;
        candidate = async (args) => {
            const ordered = orderArgsBySchema(lookup.exportSchema, args).map((value, index) =>
                preserveI64Precision(lookup.exportSchema.params[index]!, value),
            );
            const raw = host.callExport!(lookup.exportSymbol, ...ordered);
            const value = raw instanceof Promise ? await raw : raw;
            return returns ? normalizeResultByAbiType(value, returns as WasmAbiType) : value;
        };
        return { returnsAbi: returns ?? null };
    },
    async (message) => {
        if (!candidate) {
            throw new Error('尚未 load 解法');
        }
        const outcome = await executeRun(candidate, message);
        return { type: 'done', results: outcome.results, samples: outcome.samples, collectMs: outcome.collectMs };
    },
);
