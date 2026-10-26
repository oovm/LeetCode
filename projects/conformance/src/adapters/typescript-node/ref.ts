import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { median } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir } from '../../catalog/index.ts';
import { assertTestCase, normalizeTsTestResult } from '../../domain/assert.ts';
import { loadProblemMetadata, requireInvoke } from '../../domain/metadata.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';

export { assertTestCase, normalizeTsTestResult };

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
        return (args) => exported(...Object.values(args));
    }
    throw new Error(`??????? typescript entry: ${expr}`);
}

async function loadTsCandidate(problemRoot: string) {
    const metadata = loadProblemMetadata(problemRoot);
    const entry = requireInvoke(metadata, 'typescript');
    const mod = (await import(pathToFileURL(tsSolverPath(problemRoot)).href)) as Record<string, unknown>;
    const candidate = makeTsCandidate(entry, mod);
    return { tests: metadata.tests, candidate };
}

/** ????? metadata.tests?? */
export async function runTsSolverOnce(problemRoot: string, _problemId?: string): Promise<void> {
    const { tests, candidate } = await loadTsCandidate(problemRoot);
    for (const [index, case_] of tests.entries()) {
        assertTestCase(index, case_.expected, () => candidate(case_.args));
    }
}

/**
 * ??????????????? metadata.tests ??????????????????????? Node/tsx????
 */
export async function benchTsSolverInProcess(problemRoot: string, iterations: number, warmup: number): Promise<number> {
    const { tests, candidate } = await loadTsCandidate(problemRoot);

    const runAll = () => {
        for (const [index, case_] of tests.entries()) {
            assertTestCase(index, case_.expected, () => candidate(case_.args));
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
