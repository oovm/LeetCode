/**
 * 在 Bun 进程内执行（由 `run_bun_solver.ts` 调用）。
 * 复用 `solvers/typescript/solution.ts` 与 `metadata.invoke.typescript`。
 */
import { pathToFileURL } from 'node:url';

import { loadProblemCases } from '../../domain/cases-loader.ts';
import { compareModeForExecution } from '../../domain/compare-mode.ts';
import { inferIntegerArgKeys } from '../../domain/integer-args.ts';
import { loadProblemMetadata, problemIdFromDir, requireInvoke } from '../../domain/metadata.ts';
import type { TestCase } from '../../domain/problem.ts';
import { assertTsCase, makeTsCandidate, tsSolverPath } from '../typescript-node/ref.ts';

function median(values: number[]): number {
    if (!values.length) {
        throw new Error('median of empty array');
    }
    const sorted = [...values].sort((left, right) => left - right);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
}

async function loadTsCandidate(problemRoot: string) {
    const metadata = loadProblemMetadata(problemRoot);
    const entry = requireInvoke(metadata, 'typescript');
    const mod = (await import(pathToFileURL(tsSolverPath(problemRoot)).href)) as Record<string, unknown>;
    const candidate = makeTsCandidate(entry, mod);
    // 统一装载快照：断言坐标用过滤前冻结的 `sourceIndex`，不按可执行视图位置重新编号。
    const snapshot = loadProblemCases(problemRoot);
    return { id: problemIdFromDir(problemRoot), entries: snapshot.executableEntries, candidate };
}

export async function runBunSolverOnce(problemRoot: string): Promise<{ caseTotal: number; executed: number }> {
    const { id, entries, candidate } = await loadTsCandidate(problemRoot);
    const integerKeys = inferIntegerArgKeys(entries.map((entry) => entry.case));
    const mode = compareModeForExecution(id);
    for (const snapshotEntry of entries) {
        assertTsCase(snapshotEntry.sourceIndex, snapshotEntry.case as TestCase, candidate, integerKeys, mode, id);
    }
    return { caseTotal: entries.length, executed: entries.length };
}

export async function benchBunSolverInProcess(problemRoot: string, iterations: number, warmup: number): Promise<number> {
    const { id, entries, candidate } = await loadTsCandidate(problemRoot);
    const integerKeys = inferIntegerArgKeys(entries.map((entry) => entry.case));
    const mode = compareModeForExecution(id);

    const runAll = () => {
        for (const snapshotEntry of entries) {
            assertTsCase(snapshotEntry.sourceIndex, snapshotEntry.case as TestCase, candidate, integerKeys, mode, id);
        }
    };

    for (let i = 0; i < warmup; i++) {
        runAll();
    }

    const samples: number[] = [];
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        runAll();
        samples.push(performance.now() - start);
    }

    return median(samples);
}
