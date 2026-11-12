import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runPythonReference } from '../src/adapters/python/ref.ts';
import { hasReadyTsSolver, runTsReference } from '../src/adapters/typescript-node/ref.ts';
import { loadProblemCases } from '../src/domain/cases-loader.ts';
import { requireArgsConstraint, validateTestArgs } from '../src/domain/args-constraints.ts';
import { requireCompareMode } from '../src/domain/compare-mode.ts';
import { probeValkyrieProblem } from '../src/adapters/valkyrie-node/matrix.ts';
import { PROBLEMS, legionProjectDir, problemDir } from '../src/catalog/index.ts';
import { loadProblemMetadata, requireInvoke } from '../src/domain/metadata.ts';
import { CONFORMANCE_ROOT, LEETCODE_ROOT } from '../src/domain/paths.ts';

type BlockedLane = { id: string; lane: 'typescript'; caseIndex: number; reason: string };
type CoverageProblem = {
    id: string;
    expectedProvenance: 'official-static' | 'reference-generated' | 'derived-recompute' | 'host-error-text' | 'initial-corpus';
    oracleStatus: 'independent' | 'cross-checked' | 'unverified';
    coverageEligible: boolean;
};
type CoverageManifest = {
    schemaVersion: number;
    provenancePolicy?: { allowedProvenance: string[]; allowedOracleStatus: string[]; rule?: string };
    batches: Array<{ id: string; note?: string; blocked?: BlockedLane[]; problems: CoverageProblem[] }>;
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
const entries = activeBatches.flatMap((batch) => batch.problems.map((problem) => ({ problem, batch: batch.id })));
const blockedByProblem = new Map(
    activeBatches.flatMap((batch) => (batch.blocked ?? []).map((blocked) => [blocked.id, blocked] as const)),
);

describe('题库覆盖清单', () => {
    it('批次 id 唯一且题目不重复', () => {
        const batchIds = manifest.batches.map((batch) => batch.id);
        expect(new Set(batchIds).size).toBe(batchIds.length);

        const allIds = manifest.batches.flatMap((batch) => batch.problems.map((problem) => problem.id));
        expect(new Set(allIds).size).toBe(allIds.length);

        for (const batch of manifest.batches) {
            for (const blocked of batch.blocked ?? []) {
                expect(batch.problems.map((problem) => problem.id), `${batch.id}: blocked 题目不在批次内`).toContain(blocked.id);
            }
        }
    });

    it('每题显式填写期望来源与 oracle 状态', () => {
        const allowedProvenance = new Set(manifest.provenancePolicy?.allowedProvenance ?? []);
        const allowedStatus = new Set(manifest.provenancePolicy?.allowedOracleStatus ?? []);
        const missing: string[] = [];

        for (const batch of manifest.batches) {
            for (const problem of batch.problems) {
                if (!allowedProvenance.has(problem.expectedProvenance)) {
                    missing.push(`${batch.id} / ${problem.id}: expectedProvenance=${String(problem.expectedProvenance)}`);
                }
                if (!allowedStatus.has(problem.oracleStatus)) {
                    missing.push(`${batch.id} / ${problem.id}: oracleStatus=${String(problem.oracleStatus)}`);
                }
                if (typeof problem.coverageEligible !== 'boolean') {
                    missing.push(`${batch.id} / ${problem.id}: coverageEligible 缺失`);
                }
                const generated =
                    problem.expectedProvenance === 'reference-generated' || problem.expectedProvenance === 'derived-recompute';
                if (generated && problem.oracleStatus !== 'unverified') {
                    missing.push(`${batch.id} / ${problem.id}: 生成/派生来源必须标 unverified`);
                }
                if (generated && problem.coverageEligible) {
                    missing.push(`${batch.id} / ${problem.id}: 生成/派生来源不得计入覆盖率`);
                }
            }
        }

        expect(missing, missing.join('\n')).toEqual([]);
    });

    it('每题显式登记比较模式', () => {
        const missing: string[] = [];

        for (const batch of manifest.batches) {
            for (const problem of batch.problems) {
                try {
                    requireCompareMode(problem.id);
                } catch (error) {
                    missing.push(`${batch.id} / ${problem.id}: ${String(error)}`);
                }
            }
        }

        expect(missing, missing.join('\n')).toEqual([]);
    });

    it('清单内每题都有解、参考解、用例与判题入口', () => {
        const missing: string[] = [];

        for (const { problem: entry } of entries) {
            const id = entry.id;
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

            expect(loadProblemCases(root).cases.length, `${id}: cases 模块用例为空`).toBeGreaterThan(0);

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

for (const { problem: entry, batch } of entries) {
    it(
        `${batch} / ${entry.id} 三通道真实判题（Python + TypeScript + Valkyrie wasm）`,
        { timeout: 10 * 60 * 1000 },
        async () => {
            const id = entry.id;
            const problem = catalogById.get(id);
            expect(problem, `${id}: 不在 catalog`).toBeTruthy();
            if (!problem) {
                return;
            }

            // 题面约束前置：args 本身不合法时，三通道一致没有意义。
            const root = problemDir(LEETCODE_ROOT, problem);
            const cases = loadProblemCases(root).cases;
            const argsConstraint = requireArgsConstraint(id);
            const argViolations: string[] = [];
            cases.forEach((test, index) => {
                const issue = validateTestArgs(argsConstraint, test.args as Record<string, unknown>);
                if (issue) {
                    argViolations.push(`${id} tests[${index}]: ${issue}`);
                }
            });
            expect(argViolations, argViolations.join('\n')).toEqual([]);

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

            const row = await probeValkyrieProblem(problem, legionProjectDir(LEETCODE_ROOT, problem));

            expect(row.buildStatus, row.buildError ?? `V 构建失败：${root}`).toBe(0);
            // `legion test` status 不作为绿判据：项目没有 test/ 目录时它同样返回 0。
            // 绿必须拿到真实执行计数：全量 cases 真源用例真实执行且全部通过。
            expect(row.manifestFresh, row.manifestError ?? 'execution manifest 已过期').toBe(true);
            expect(row.runtimeOk, row.runtimeError ?? 'cases 模块用例未执行').toBe(true);
            expect(row.testCaseTotal, 'cases 模块用例数为 0').toBeGreaterThan(0);
            expect(row.blocked, row.firstFailure ?? '存在 blocked 用例').toBe(0);
            expect(row.not_run, row.firstFailure ?? '存在未执行用例').toBe(0);
            expect(row.executed_fail, row.firstFailure ?? '存在失败用例').toBe(0);
            expect(row.executed_pass, row.firstFailure ?? '通过数不等于用例总数').toBe(row.testCaseTotal);
        },
    );
}
