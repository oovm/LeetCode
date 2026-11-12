import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { median } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir } from '../../catalog/index.ts';
import { assertTestCase, normalizeTsTestResult } from '../../domain/assert.ts';
import { loadProblemCases } from '../../domain/cases-loader.ts';
import { compareModeForExecution, type CompareMode } from '../../domain/compare-mode.ts';
import { coerceIntegerArgs as coerceTsArgs, inferIntegerArgKeys } from '../../domain/integer-args.ts';
import { loadProblemMetadata, problemIdFromDir, requireInvoke } from '../../domain/metadata.ts';
import {
    assertOperationSequence,
    isOperationSequenceArgs,
    isOperationSequenceCase,
    runOperationSequence,
} from '../../domain/operation-sequence.ts';
import type { TestCase } from '../../domain/problem.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';

export { assertTestCase, coerceTsArgs, inferIntegerArgKeys, normalizeTsTestResult };

export function slugToTsProject(slug: string): string {
    let name = slug.replace(/-/g, '_');
    if (/^[0-9]/.test(name)) {
        name = `lc_${name}`;
    }
    return name;
}

export function tsSolverPath(problemRoot: string): string {
    return join(problemRoot, 'solvers', 'typescript', 'solution.ts');
}

export function hasTsSolver(problemRoot: string, _problemId?: string): boolean {
    try {
        readFileSync(tsSolverPath(problemRoot), 'utf8');
        return true;
    } catch {
        return false;
    }
}

/** ??????? `export class Solution` ????????? LCD ??????? */
export function hasReadyTsSolver(problemRoot: string): boolean {
    try {
        const text = readFileSync(tsSolverPath(problemRoot), 'utf8');
        return text.includes('export class Solution');
    } catch {
        return false;
    }
}

/** ???? `Solution().twoSum` ?? LeetCode ??????? */
export function makeTsCandidate(entryPoint: string, mod: Record<string, unknown>): (args: Record<string, unknown>) => unknown {
    const expr = entryPoint.trim();
    const classMethod = expr.match(/^Solution\(\)\.(\w+)$/);
    if (classMethod) {
        const method = classMethod[1];
        const Solution = mod.Solution;
        if (typeof Solution !== 'function') {
            throw new Error('solution.ts ??? export class Solution');
        }
        return (args) => {
            const instance = new (Solution as new () => Record<string, (...values: unknown[]) => unknown>)();
            const fn = instance[method];
            if (typeof fn !== 'function') {
                throw new Error(`Solution ?????? ${method}`);
            }
            return fn.call(instance, ...Object.values(args));
        };
    }
    const exported = mod[expr];
    if (typeof exported === 'function') {
        return (args) => {
            if (isOperationSequenceArgs(args)) {
                return runOperationSequence(expr, exported as new (...values: unknown[]) => Record<string, unknown>, args);
            }
            return exported(...Object.values(args));
        };
    }
    throw new Error(`??????? typescript entry: ${expr}`);
}

/** 单调用用例外层直接断言；设计类用例按构造 + 逐操作逐步断言。 */
export function assertTsCase(
    index: number,
    case_: TestCase,
    candidate: (args: Record<string, unknown>) => unknown,
    integerKeys: ReadonlySet<string>,
    mode: CompareMode = 'strict',
    problemId = '',
): void {
    if (isOperationSequenceCase(case_)) {
        const args = case_.args as unknown as Record<string, unknown>;
        const actual = candidate(coerceTsArgs(args, integerKeys));
        assertOperationSequence(index, case_.args, case_.expected, actual);
        return;
    }
    assertTestCase(index, case_.expected, () => candidate(coerceTsArgs(case_.args, integerKeys)), undefined, mode, {
        problemId,
        args: case_.args,
    });
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

/** 返回真实执行计数，供基线区分「全部断言通过」与「空跑也退 0」。 */
export async function runTsSolverOnce(problemRoot: string, _problemId?: string): Promise<{ caseTotal: number; executed: number }> {
    const { id, entries, candidate } = await loadTsCandidate(problemRoot);
    const integerKeys = inferIntegerArgKeys(entries.map((entry) => entry.case));
    const mode = compareModeForExecution(id);
    for (const snapshotEntry of entries) {
        assertTsCase(snapshotEntry.sourceIndex, snapshotEntry.case as TestCase, candidate, integerKeys, mode, id);
    }
    return { caseTotal: entries.length, executed: entries.length };
}

/**
 * ??????????????? cases 用例 ??????????????????????? Node/tsx????
 */
export async function benchTsSolverInProcess(problemRoot: string, iterations: number, warmup: number): Promise<number> {
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

export async function runTsReference(problem: ProblemDefinition): Promise<{ ok: boolean; stderr: string }> {
    const root = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    if (!hasTsSolver(root)) {
        return { ok: false, stderr: `missing ${tsSolverPath(root)}` };
    }
    try {
        await runTsSolverOnce(root, problem.id);
        return { ok: true, stderr: '' };
    } catch (err) {
        return { ok: false, stderr: String(err) };
    }
}
