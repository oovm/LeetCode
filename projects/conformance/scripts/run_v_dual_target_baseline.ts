#!/usr/bin/env node
/**
 * Valkyrie 双 target 批次基线：`wasm` 与 `ovm` 各自在独立子进程里构建 + 真跑 `<slug>.cases.ts`。
 *
 * 口径：
 * - 一个 target 的结果绝不复制自另一个；两 lane 分别记录总数 / 通过 / 失败 / blocked / 未验证。
 * - `pass` 必须 build 成功、artifact 新鲜、`executed_pass === testCaseTotal > 0`。
 * - `skipped` 不抵扣分母、不计入 pass；超时与 runtime pending 进「未验证」桶。
 * - 子进程崩溃（含 napi panic）单列 `blocked`，不把整个批次带崩。
 * - `ovm` 构建前清理输出目录里的旧 `.nyar` 产物（`.odin` 是当前产物身份，旧 `.nyar` 会让
 *   `legion build` 拒绝重建）；只删本目录内的 `.nyar` 文件，不递归、不删目录。
 *
 * 用法：
 *   node --import tsx scripts/run_v_dual_target_baseline.ts --lane wasm --offset 0 --limit 60 --out .cache/v-baseline-wasm-0-60.jsonl
 *   node --import tsx scripts/run_v_dual_target_baseline.ts --lane ovm  --offset 0 --limit 60 --out .cache/v-baseline-ovm-0-60.jsonl
 */
import { spawnSync } from 'node:child_process';
import { appendFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PROBLEMS, legionProjectDir, problemDir } from '../src/catalog/index.ts';
import { probeValkyrieProblem } from '../src/adapters/valkyrie-node/matrix.ts';
import { probeValkyrieBackendProblem, type ValkyrieBackendLaneTarget } from '../src/adapters/valkyrie-backend/matrix.ts';
import { hasValkyrieSolver, valkyrieSolverBlockedReason } from '../src/adapters/valkyrie-node/valkyrie.ts';
import { nyarBuildDir } from '../src/adapters/valkyrie-nyar/valkyrie.ts';
import { LEETCODE_ROOT } from '../src/domain/paths.ts';

const SELF = fileURLToPath(import.meta.url);

type Lane = 'wasm' | 'ovm';
type Status = 'pass' | 'fail' | 'blocked' | 'unverified';

type Row = {
    id: string;
    lane: Lane;
    status: Status;
    target: string;
    buildStatus: number;
    manifestFresh: boolean;
    caseTotal: number;
    executedPass: number;
    executedFail: number;
    blockedCases: number;
    notRunCases: number;
    skippedCases: number;
    outcome: string;
    reason: string | null;
    ms: number;
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

function normalizeLane(raw: string | null): Lane {
    if (raw === 'wasm' || raw === 'ovm') {
        return raw;
    }
    throw new Error('缺少 --lane wasm|ovm');
}

function classify(row: Awaited<ReturnType<typeof probeValkyrieProblem>> | Awaited<ReturnType<typeof probeValkyrieBackendProblem>>, lane: Lane, ms: number): Row {
    const base = {
        id: row.id,
        lane,
        target: row.target,
        buildStatus: row.buildStatus,
        manifestFresh: row.manifestFresh,
        caseTotal: row.testCaseTotal,
        executedPass: row.executed_pass,
        executedFail: row.executed_fail,
        blockedCases: row.blocked,
        notRunCases: row.not_run,
        skippedCases: row.skipped ?? 0,
        outcome: row.outcome,
        ms,
    };
    if (row.solverNote) {
        return { ...base, status: 'blocked', reason: `题解不可用：${row.solverNote}` };
    }
    if (row.targetError) {
        return { ...base, status: 'blocked', reason: `target 计划失败：${row.targetError}` };
    }
    if (row.buildStatus !== 0) {
        return { ...base, status: 'fail', reason: row.buildError ?? 'legion build 失败' };
    }
    if (!row.manifestFresh) {
        return { ...base, status: 'unverified', reason: row.manifestError ?? 'execution manifest 不新鲜' };
    }
    if (row.outcome === 'blocked') {
        return { ...base, status: 'blocked', reason: row.runtimeReason ?? row.runtimeError ?? '判题被阻塞，未拿到真实执行计数' };
    }
    if (row.runtimeStatus !== 'ready' || !row.runtimeOk) {
        const infrastructure = row.blocked > 0 || row.runtimeStatus !== 'ready';
        const reason = infrastructure
            ? row.runtimeError ?? row.runtimeReason ?? 'runtime 未就绪'
            : row.firstFailure ?? row.runtimeError ?? row.runtimeReason ?? 'runtime 未就绪';
        return { ...base, status: infrastructure ? 'unverified' : 'fail', reason };
    }
    if (row.green && row.testCaseTotal > 0 && row.executed_pass === row.testCaseTotal) {
        return { ...base, status: 'pass', reason: null };
    }
    return {
        ...base,
        status: 'fail',
        reason: row.firstFailure
            ?? `executed_pass=${row.executed_pass}/${row.testCaseTotal}（skipped=${row.skipped ?? 0}）`,
    };
}

/** 旧 `.nyar` 与当前 `.odin` 产物身份不符会让 `legion build` 拒绝重建；只清理本目录内的旧产物文件。 */
function clearStaleNyarArtifacts(problem: Parameters<typeof nyarBuildDir>[0]): void {
    const outDir = nyarBuildDir(problem);
    let names: string[];
    try {
        names = readdirSync(outDir);
    } catch {
        return;
    }
    for (const name of names) {
        if (name.endsWith('.nyar')) {
            unlinkSync(join(outDir, name));
        }
    }
}

async function runChild(lane: Lane, problemId: string): Promise<void> {
    const problem = PROBLEMS.find((item) => item.id === problemId);
    if (!problem) {
        throw new Error(`未找到题目 ${problemId}`);
    }
    const projectPath = legionProjectDir(LEETCODE_ROOT, problem);
    const startedAt = Date.now();
    if (lane === 'wasm') {
        const row = await probeValkyrieProblem(problem, projectPath);
        console.log(JSON.stringify(classify(row, lane, Date.now() - startedAt)));
        return;
    }
    clearStaleNyarArtifacts(problem);
    const row = await probeValkyrieBackendProblem(problem, projectPath, lane as ValkyrieBackendLaneTarget);
    console.log(JSON.stringify(classify(row, lane, Date.now() - startedAt)));
}

function tail(text: string, max = 420): string {
    const lines = String(text ?? '')
        .trim()
        .split(/\r?\n/)
        .filter(Boolean);
    return lines.slice(-3).join(' | ').slice(0, max);
}

function looksLikePanic(child: { status: number | null; signal: string | null; stdout: string; stderr: string }): boolean {
    if (child.signal) {
        return true;
    }
    return child.status !== null && child.status !== 0 && !child.stdout.includes('"status"');
}

async function main(): Promise<void> {
    const oneId = readArg('--one-id');
    const lane = normalizeLane(readArg('--lane'));
    if (oneId) {
        await runChild(lane, oneId);
        return;
    }

    const offset = readNumber('--offset', 0);
    const limit = readNumber('--limit', 60);
    const timeoutMs = readNumber('--timeout', 180000);
    const outPath = readArg('--out');
    if (!outPath) {
        throw new Error('缺少 --out');
    }

    const candidates = PROBLEMS.filter((problem) => {
        const root = problemDir(LEETCODE_ROOT, problem);
        return hasValkyrieSolver(root) && valkyrieSolverBlockedReason(root) === null;
    });
    const slice = candidates.slice(offset, offset + limit);

    writeFileSync(outPath, '', 'utf8');
    const counts: Record<Status, number> = { pass: 0, fail: 0, blocked: 0, unverified: 0 };
    let caseTotal = 0;
    let executedPass = 0;
    let executedFail = 0;
    const reasons = new Map<string, number>();
    const startedAt = Date.now();

    for (let index = 0; index < slice.length; index += 1) {
        const problem = slice[index];
        const startedProblem = Date.now();
        const child = spawnSync(process.execPath, ['--import', 'tsx', SELF, '--one-id', problem.id, '--lane', lane], {
            cwd: fileURLToPath(new URL('..', import.meta.url)),
            encoding: 'utf8',
            timeout: timeoutMs,
            maxBuffer: 8 * 1024 * 1024,
        });
        const ms = Date.now() - startedProblem;
        let row: Row;
        if (child.error && (child.error as NodeJS.ErrnoException).code === 'ETIMEDOUT') {
            row = {
                id: problem.id,
                lane,
                status: 'unverified',
                target: '',
                buildStatus: 1,
                manifestFresh: false,
                caseTotal: 0,
                executedPass: 0,
                executedFail: 0,
                blockedCases: 0,
                notRunCases: 0,
                skippedCases: 0,
                outcome: 'unverified',
                reason: `子进程超时 ${timeoutMs}ms`,
                ms,
            };
        } else if (child.error) {
            row = {
                id: problem.id,
                lane,
                status: 'blocked',
                target: '',
                buildStatus: 1,
                manifestFresh: false,
                caseTotal: 0,
                executedPass: 0,
                executedFail: 0,
                blockedCases: 0,
                notRunCases: 0,
                skippedCases: 0,
                outcome: 'blocked',
                reason: `子进程启动失败：${child.error.message}`,
                ms,
            };
        } else {
            const stdout = String(child.stdout ?? '');
            const parsed = stdout
                .trim()
                .split(/\r?\n/)
                .filter((line) => line.startsWith('{'))
                .pop();
            if (!parsed) {
                row = {
                    id: problem.id,
                    lane,
                    status: 'blocked',
                    target: '',
                    buildStatus: 1,
                    manifestFresh: false,
                    caseTotal: 0,
                    executedPass: 0,
                    executedFail: 0,
                    blockedCases: 0,
                    notRunCases: 0,
                    skippedCases: 0,
                    outcome: 'blocked',
                    reason: looksLikePanic({ status: child.status, signal: child.signal ?? null, stdout, stderr: String(child.stderr ?? '') })
                        ? `子进程崩溃（${child.signal ?? child.status}）：${tail(String(child.stderr ?? ''))}`
                        : `无结构化结果：${tail(String(child.stderr ?? '') || stdout)}`,
                    ms,
                };
            } else {
                row = JSON.parse(parsed) as Row;
                row.ms = ms;
            }
        }

        counts[row.status] += 1;
        caseTotal += row.caseTotal;
        executedPass += row.executedPass;
        executedFail += row.executedFail;
        if (row.reason) {
            const key = `${row.status}: ${row.reason}`;
            reasons.set(key, (reasons.get(key) ?? 0) + 1);
        }
        appendFileSync(outPath, `${JSON.stringify(row)}\n`);
        if ((index + 1) % 5 === 0 || index + 1 === slice.length) {
            process.stderr.write(
                `[${lane} ${offset}-${offset + slice.length}] ${index + 1}/${slice.length} ` +
                    `pass=${counts.pass} fail=${counts.fail} blocked=${counts.blocked} unverified=${counts.unverified} ` +
                    `elapsed=${Math.round((Date.now() - startedAt) / 1000)}s\n`,
            );
        }
    }

    console.log(
        JSON.stringify({
            lane,
            offset,
            limit,
            scopeTotal: candidates.length,
            attempted: slice.length,
            pass: counts.pass,
            fail: counts.fail,
            blocked: counts.blocked,
            unverified: counts.unverified,
            caseTotal,
            executedPass,
            executedFail,
            seconds: Math.round((Date.now() - startedAt) / 1000),
            reasons: Object.fromEntries([...reasons.entries()].sort((left, right) => right[1] - left[1])),
        }),
    );
}

main().catch((error) => {
    console.error(String(error));
    process.exit(1);
});
