#!/usr/bin/env node
/**
 * TypeScript lane 批次基线：逐题在独立子进程里跑 Node 或 Bun，记录真实执行计数与失败原因。
 *
 * 口径：
 * - `pass` 必须拿到「用例总数 == 实际执行数 > 0」的成功摘要，退出码 0 本身不算通过。
 * - 空 `solution.ts`、缺 `export class Solution` 显式记 `fail`，不进 pass 桶。
 * - 超时、子进程崩溃单列 `unverified`，不抵扣分母，也不计入 pass。
 * - 默认题面范围与 V canonical 一致（有 `solution.v` 且无阻塞标记），保证两条 lane 可比。
 *
 * 用法：
 *   node --import tsx scripts/run_ts_lane_baseline.ts --channel node --offset 0 --limit 120 --out .cache/ts-baseline-node-0-120.jsonl
 *   node --import tsx scripts/run_ts_lane_baseline.ts --channel bun  --offset 0 --limit 120 --out .cache/ts-baseline-bun-0-120.jsonl
 */
import { spawnSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { PROBLEMS, problemDir } from '../src/catalog/index.ts';
import { bunExecutable } from '../src/adapters/typescript-bun/bridge.ts';
import { hasTsSolver, tsSolverPath } from '../src/adapters/typescript-node/ref.ts';
import { hasValkyrieSolver, valkyrieSolverBlockedReason } from '../src/adapters/valkyrie-node/valkyrie.ts';
import { loadProblemCases } from '../src/domain/cases-loader.ts';
import { LEETCODE_ROOT } from '../src/domain/paths.ts';

const CONFORMANCE_ROOT = fileURLToPath(new URL('..', import.meta.url));
const TS_SOLVER_SCRIPT = fileURLToPath(new URL('./run_ts_solver.ts', import.meta.url));
const BUN_SOLVER_SCRIPT = fileURLToPath(new URL('./run_bun_solver.ts', import.meta.url));

type Channel = 'node' | 'bun';
type Status = 'pass' | 'fail' | 'blocked' | 'unverified';

type Row = {
    id: string;
    channel: Channel;
    status: Status;
    caseTotal: number;
    executed: number;
    ms: number;
    reason: string | null;
};

function readArg(name: string): string | null {
    const index = process.argv.indexOf(name);
    return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : null;
}

function readNumber(name: string, fallback: number): number {
    const raw = readArg(name);
    if (!raw) {
        return fallback;
    }
    const parsed = Number(raw);
    if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error(`invalid ${name}=${raw}`);
    }
    return Math.floor(parsed);
}

const channel = readArg('--channel') as Channel | null;
if (channel !== 'node' && channel !== 'bun') {
    console.error('缺少 --channel node|bun');
    process.exit(2);
}

const scope = readArg('--scope') ?? 'canonical';
const offset = readNumber('--offset', 0);
const limit = readNumber('--limit', 200);
const timeoutMs = readNumber('--timeout', 60000);
const outPath = readArg('--out');
if (!outPath) {
    console.error('缺少 --out');
    process.exit(2);
}

const candidates =
    scope === 'all-ts'
        ? PROBLEMS.filter((problem) => hasTsSolver(problemDir(LEETCODE_ROOT, problem)))
        : PROBLEMS.filter((problem) => {
            const root = problemDir(LEETCODE_ROOT, problem);
            return hasValkyrieSolver(root) && valkyrieSolverBlockedReason(root) === null;
        });

const slice = candidates.slice(offset, offset + limit);

if (process.argv.includes('--list')) {
    slice.forEach((problem, index) => console.log(`${offset + index}\t${problem.id}`));
    process.exit(0);
}

function testCaseTotal(root: string): number | null {
    try {
        return loadProblemCases(root).executable.length;
    } catch {
        return null;
    }
}

function firstFailureIndex(text: string): number | null {
    const match = text.match(/tests\[(\d+)\]/);
    return match ? Number(match[1]) : null;
}

function tail(text: string, max = 420): string {
    const lines = String(text ?? '')
        .trim()
        .split(/\r?\n/)
        .filter(Boolean);
    return lines.slice(-3).join(' | ').slice(0, max);
}

function runProblem(problem: (typeof PROBLEMS)[number]): Row {
    const startedAt = Date.now();
    const root = problemDir(LEETCODE_ROOT, problem);
    const total = testCaseTotal(root);
    const base = { id: problem.id, channel, caseTotal: total ?? 0, executed: 0, ms: 0 };

    if (!hasTsSolver(root)) {
        return { ...base, status: 'blocked', ms: Date.now() - startedAt, reason: `缺失 ${tsSolverPath(root)}` };
    }
    const source = readFileSync(tsSolverPath(root), 'utf8');
    if (source.trim().length === 0) {
        return { ...base, status: 'fail', ms: Date.now() - startedAt, reason: 'solution.ts 为空（空跑不判通过）' };
    }
    if (!source.includes('export class Solution')) {
        return { ...base, status: 'fail', ms: Date.now() - startedAt, reason: 'solution.ts 未导出 export class Solution' };
    }
    if (total === null || total === 0) {
        return { ...base, status: 'fail', ms: Date.now() - startedAt, reason: 'cases 模块缺失或可执行用例为空（无真实执行计数）' };
    }

    const exe = channel === 'bun' ? bunExecutable() : process.execPath;
    const args = channel === 'bun' ? [BUN_SOLVER_SCRIPT, root] : ['--import', 'tsx', TS_SOLVER_SCRIPT, root];
    const useShell = channel === 'bun' && (exe === 'bun' || /\.(cmd|bat)$/i.test(exe));
    const child = spawnSync(exe, args, {
        cwd: CONFORMANCE_ROOT,
        encoding: 'utf8',
        timeout: timeoutMs,
        maxBuffer: 8 * 1024 * 1024,
        shell: useShell,
    });
    const ms = Date.now() - startedAt;

    if (child.error && (child.error as NodeJS.ErrnoException).code === 'ETIMEDOUT') {
        return { ...base, status: 'unverified', ms, reason: `超时 ${timeoutMs}ms，未拿到执行计数` };
    }
    if (!child.error && child.signal) {
        return { ...base, status: 'unverified', ms, reason: `runner 被信号 ${child.signal} 终止` };
    }
    if (child.error) {
        return { ...base, status: 'unverified', ms, reason: `runner 启动失败：${child.error.message}` };
    }

    const stderr = String(child.stderr ?? '');
    if (child.status !== 0) {
        const index = firstFailureIndex(stderr);
        return {
            ...base,
            status: 'fail',
            executed: index === null ? 0 : index + 1,
            ms,
            reason: tail(stderr) || `runner exit ${child.status}`,
        };
    }

    const line = String(child.stdout ?? '')
        .trim()
        .split(/\r?\n/)
        .filter((item) => item.startsWith('{'))
        .pop();
    let summary: { caseTotal?: unknown; executed?: unknown } | null = null;
    try {
        summary = line ? (JSON.parse(line) as { caseTotal?: unknown; executed?: unknown }) : null;
    } catch {
        summary = null;
    }
    if (!summary || typeof summary.caseTotal !== 'number' || typeof summary.executed !== 'number') {
        return { ...base, status: 'fail', ms, reason: '空跑：退出码 0 但未拿到真实执行计数' };
    }
    if (summary.caseTotal <= 0 || summary.executed !== summary.caseTotal) {
        return {
            ...base,
            status: 'fail',
            executed: summary.executed,
            ms,
            reason: `执行计数不完整：executed=${summary.executed}/${summary.caseTotal}`,
        };
    }
    return { ...base, status: 'pass', executed: summary.executed, ms, reason: null };
}

writeFileSync(outPath, '', 'utf8');
const startedAt = Date.now();
const counts: Record<Status, number> = { pass: 0, fail: 0, blocked: 0, unverified: 0 };
let caseTotal = 0;
let executed = 0;
const reasons = new Map<string, number>();

for (let index = 0; index < slice.length; index += 1) {
    const problem = slice[index];
    const row = runProblem(problem);
    counts[row.status] += 1;
    caseTotal += row.caseTotal;
    executed += row.executed;
    if (row.reason) {
        const key = `${row.status}: ${row.reason}`;
        reasons.set(key, (reasons.get(key) ?? 0) + 1);
    }
    appendFileSync(outPath, `${JSON.stringify(row)}\n`);
    if ((index + 1) % 10 === 0 || index + 1 === slice.length) {
        process.stderr.write(
            `[${channel} ${offset}-${offset + slice.length}] ${index + 1}/${slice.length} ` +
                `pass=${counts.pass} fail=${counts.fail} blocked=${counts.blocked} unverified=${counts.unverified} ` +
                `elapsed=${Math.round((Date.now() - startedAt) / 1000)}s\n`,
        );
    }
}

console.log(
    JSON.stringify({
        channel,
        scope,
        offset,
        limit,
        scopeTotal: candidates.length,
        attempted: slice.length,
        pass: counts.pass,
        fail: counts.fail,
        blocked: counts.blocked,
        unverified: counts.unverified,
        caseTotal,
        executed,
        seconds: Math.round((Date.now() - startedAt) / 1000),
        reasons: Object.fromEntries([...reasons.entries()].sort((left, right) => right[1] - left[1])),
    }),
);
