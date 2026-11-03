/**
 * TypeScript 解法子进程入口。
 *
 * Node 侧：`node --import tsx <本文件>`；Bun 侧：`bun <本文件>`。
 * 两侧跑同一脚本、同一 NDJSON 协议、同一计时口径（`child-loops.ts`），
 * 判题器（父进程）不加载解法，子进程不加载判题逻辑，JIT 上下文完全分离。
 */
import { pathToFileURL } from 'node:url';

import { executeRun } from './child-loops.ts';
import { serveChild } from './child-server.ts';
import { makeCandidate, type Candidate } from './ts-entry.ts';

let candidate: Candidate | null = null;

serveChild(
    async (message) => {
        if (!message.solution) {
            throw new Error('load 消息缺少 solution 路径');
        }
        const mod = (await import(pathToFileURL(message.solution).href)) as Record<string, unknown>;
        candidate = makeCandidate(message.invoke, mod);
    },
    async (message) => {
        if (!candidate) {
            throw new Error('尚未 load 解法');
        }
        const outcome = await executeRun(candidate, message);
        return { type: 'done', results: outcome.results, samples: outcome.samples, collectMs: outcome.collectMs };
    },
);
