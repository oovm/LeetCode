import { dirname, join } from 'node:path';

import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { PROBLEMS, legionProjectDir, problemDir } from '../src/catalog/index.ts';
import { problemsForBatch } from '../src/planning/batch-limit.ts';

import { probeValkyrieProblem } from '../src/adapters/valkyrie-node/matrix.ts';
import { probeValkyrieNyarProblem } from '../src/adapters/valkyrie-nyar/matrix.ts';

import { pythonRefReady, pythonSkipReason, runPythonSolver as runPythonReference } from '../src/adapters/python/ref.ts';

import { hasValkyrieSolver, valkyrieNativeRunnerReady } from '../src/adapters/valkyrie-node/valkyrie.ts';
import { valkyrieNyarRunnerReady } from '../src/adapters/valkyrie-nyar/valkyrie.ts';

const LEETCODE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

const BATCH_PROBLEMS = problemsForBatch(PROBLEMS, { fallbackKeys: ['LEETCODE_TEST_LIMIT'] });

describe('Python ÊµÏÖÍê±¸ÐÔ£¨LeetCodeDataset£©', () => {
    const ready = pythonRefReady();

    for (const problem of BATCH_PROBLEMS) {
        it.skipIf(!ready)(`${problem.id} canonical solution Í¨¹ýÊý¾Ý¼¯²âÊÔ`, { timeout: 5 * 60 * 1000 }, () => {
            const result = runPythonReference(problem);

            if (!result.ok) {
                throw new Error(result.stderr || pythonSkipReason() || 'python reference failed');
            }

            expect(result.ok).toBe(true);
        });
    }
});

describe('Valkyrie wasm Íê±¸ÐÔ£¨legion build + metadata.tests£©', () => {
    const ready = valkyrieNativeRunnerReady();

    for (const problem of BATCH_PROBLEMS) {
        const problemRoot = problemDir(LEETCODE_ROOT, problem);
        const hasSolver = hasValkyrieSolver(problemRoot);

        it.skipIf(!ready || !hasSolver)(
            `${problem.id} legion buildï¼ˆæŒ‰ manifest targetï¼‰ ÇÒ metadata.tests ±ØÐëÍ¨¹ý`,
            { timeout: 10 * 60 * 1000 },
            async () => {
                const projectPath = legionProjectDir(LEETCODE_ROOT, problem);
                const row = await probeValkyrieProblem(problem, projectPath);

                expect(row.buildStatus, row.buildError ?? 'build failed').toBe(0);
                expect(row.testStatus, row.testError ?? 'legion test failed').toBe(0);
                expect(row.manifestFresh, row.manifestError ?? 'execution manifest stale').toBe(true);
                expect(row.runtimeOk, row.runtimeError ?? 'metadata.tests failed').toBe(true);
            },
        );
    }
});

describe('Valkyrie nyar Íê±¸ÐÔ£¨legion build --target nyar + metadata.tests£©', () => {
    const ready = valkyrieNyarRunnerReady();

    for (const problem of BATCH_PROBLEMS) {
        const problemRoot = problemDir(LEETCODE_ROOT, problem);
        const hasSolver = hasValkyrieSolver(problemRoot);

        it.skipIf(!ready || !hasSolver)(
            `${problem.id} legion build --target nyar ÇÒ metadata.tests ±ØÐëÍ¨¹ý`,
            { timeout: 10 * 60 * 1000 },
            async () => {
                const projectPath = legionProjectDir(LEETCODE_ROOT, problem);
                const row = await probeValkyrieNyarProblem(problem, projectPath);

                expect(row.buildStatus, row.buildError ?? 'build failed').toBe(0);
                expect(row.testStatus, row.testError ?? 'legion test failed').toBe(0);
                expect(row.manifestFresh, row.manifestError ?? 'execution manifest stale').toBe(true);
                expect(row.runtimeOk, row.runtimeError ?? 'metadata.tests failed').toBe(true);
            },
        );
    }
});
