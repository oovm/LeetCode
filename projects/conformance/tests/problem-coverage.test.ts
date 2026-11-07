import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runPythonReference } from '../src/adapters/python/ref.ts';
import { hasReadyTsSolver, runTsReference } from '../src/adapters/typescript-node/ref.ts';
import { probeValkyrieProblem } from '../src/adapters/valkyrie-node/matrix.ts';
import { PROBLEMS, legionProjectDir, problemDir } from '../src/catalog/index.ts';
import { loadProblemMetadata, requireInvoke } from '../src/domain/metadata.ts';
import { CONFORMANCE_ROOT, LEETCODE_ROOT } from '../src/domain/paths.ts';

type BlockedLane = { id: string; lane: 'typescript'; caseIndex: number; reason: string };
type CoverageManifest = {
    schemaVersion: number;
    batches: Array<{ id: string; note?: string; blocked?: BlockedLane[]; problems: string[] }>;
};

const MANIFEST_PATH = join(CONFORMANCE_ROOT, 'coverage', 'verified-problems.json');
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) as CoverageManifest;

const requestedBatch = process.env.LEETCODE_COVERAGE_BATCH?.trim();
const activeBatches = requestedBatch
    ? manifest.batches.filter((batch) => batch.id === requestedBatch)
    : manifest.batches;

if (requestedBatch && activeBatches.length === 0) {
    throw new Error(`未找到覆盖批次 ${requestedBatch}，可选：${manifest.batches.map((batch) => batch.id).join(', ')}`);
}

const catalogById = new Map(PROBLEMS.map((problem) => [problem.id, problem]));
const entries = activeBatches.flatMap((batch) => batch.problems.map((id) => ({ id, batch: batch.id })));
const blockedByProblem = new Map(
    activeBatches.flatMap((batch) => (batch.blocked ?? []).map((blocked) => [blocked.id, blocked] as const)),
);

describe('题库覆盖清单', () => {
    it('批次 id 唯一且题目不重复', () => {
        const batchIds = manifest.batches.map((batch) => batch.id);
        expect(new Set(batchIds).size).toBe(batchIds.length);

        const allIds = manifest.batches.flatMap((batch) => batch.problems);
        expect(new Set(allIds).size).toBe(allIds.length);

        for (const batch of manifest.batches) {
            for (const blocked of batch.blocked ?? []) {
                expect(batch.problems, `${batch.id}: blocked 题目不在批次内`).toContain(blocked.id);
            }
        }
    });

    it('清单内每题都有解、参考解、用例与判题入口', () => {
        const missing: string[] = [];

        for (const { id } of entries) {
            const problem = catalogById.get(id);
            if (!problem) {
                missing.push(`${id}: 不在 catalog`);
                continue;
            }
            const root = problemDir(LEETCODE_ROOT, problem);

            let metadata: ReturnType<typeof loadProblemMetadata>;
            try {
                metadata = loadProblemMetadata(root);
                requireInvoke(metadata, 'valkyrie');
                requireInvoke(metadata, 'typescript');
            } catch (error) {
                missing.push(`${id}: ${String(error)}`);
                continue;
            }

            expect(metadata.tests.length, `${id}: metadata.tests 为空`).toBeGreaterThan(0);

            const solution = readFileSync(join(root, 'solvers', 'valkyrie', 'solution.v'), 'utf8').trim();
            if (solution.length === 0) {
                missing.push(`${id}: solution.v 为空`);
            } else if (solution.startsWith('# ')) {
                missing.push(`${id}: solution.v 仅占位`);
            } else if (!solution.includes('[export')) {
                missing.push(`${id}: solution.v 缺少 [export] 入口`);
            }

            if (!hasReadyTsSolver(root)) {
                missing.push(`${id}: solutions/typescript/solution.ts 缺失或不是 export class Solution`);
            }
        }

        expect(missing, missing.join('\n')).toEqual([]);
    });
});

for (const { id, batch } of entries) {
    it(
        `${batch} / ${id} 三通道真实判题（Python + TypeScript + Valkyrie wasm）`,
        { timeout: 10 * 60 * 1000 },
        async () => {
            const problem = catalogById.get(id);
            expect(problem, `${id}: 不在 catalog`).toBeTruthy();
            if (!problem) {
                return;
            }

            const python = runPythonReference(problem);
            expect(python.ok, `python 参照解失败：${python.stderr}`).toBe(true);

            const typescript = await runTsReference(problem);
            const blocked = blockedByProblem.get(id);
            if (blocked) {
                expect(
                    typescript.ok,
                    `已登记 blocked 的 ${blocked.id} TS 用例 #${blocked.caseIndex} 意外通过，请复核后从清单移除：${blocked.reason}`,
                ).toBe(false);
                expect(typescript.stderr).toContain(`tests[${blocked.caseIndex}]`);
            } else {
                expect(typescript.ok, `typescript 参照解失败：${typescript.stderr}`).toBe(true);
            }

            const root = problemDir(LEETCODE_ROOT, problem);
            const row = await probeValkyrieProblem(problem, legionProjectDir(LEETCODE_ROOT, problem));

            expect(row.buildStatus, row.buildError ?? `V 构建失败：${root}`).toBe(0);
            expect(row.testStatus, row.testError ?? 'legion test 失败').toBe(0);
            expect(row.manifestFresh, row.manifestError ?? 'execution manifest 已过期').toBe(true);
            expect(row.runtimeOk, row.runtimeError ?? 'metadata.tests 未执行').toBe(true);
            expect(row.testCaseTotal, 'metadata.tests 用例数为 0').toBeGreaterThan(0);
            expect(row.blocked, row.firstFailure ?? '存在 blocked 用例').toBe(0);
            expect(row.not_run, row.firstFailure ?? '存在未执行用例').toBe(0);
            expect(row.executed_fail, row.firstFailure ?? '存在失败用例').toBe(0);
            expect(row.executed_pass, row.firstFailure ?? '通过数不等于用例总数').toBe(row.testCaseTotal);
        },
    );
}
