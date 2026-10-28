import { join } from 'node:path';

import { collectValkyrieBenchEnvironment } from '../../reporting/environment.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import { defineSolverAdapter } from '../factory.ts';
import { problemDir, valkyrieProjectDir } from '../catalog/index.ts';
import { runResultFromReference } from '../shared/correctness-result.ts';
import { benchValkyrieProblem } from './bench.ts';
import { resolveCompileTargetFromManifest } from './manifest.ts';
import { runVReference } from './ref.ts';
import { hasValkyrieSolver, valkyrieRunnerReady, valkyrieSkipReason } from './valkyrie.ts';

export const valkyrieNodeAdapter = defineSolverAdapter({
    implementationId: 'valkyrie-node',
    hasSolver: hasValkyrieSolver,
    runnerReady: valkyrieRunnerReady,
    blockedReason: valkyrieSkipReason,
    collectEnvironment: collectValkyrieBenchEnvironment,
    async benchProblem(problem) {
        const result = benchValkyrieProblem(problem);
        // benchTarget 从该题 manifest 解析 —— 每个 problem 可以有自己的 compile target
        let benchTarget = 'manifest';
        try {
            const projectDir = valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
            benchTarget = resolveCompileTargetFromManifest(projectDir);
        } catch {
            // manifest 解析失败时保留占位字符串，上层会看到具体错误
        }
        return {
            compileMs: result.vCompileMs,
            runtimeMs: result.vRuntimeMs,
            legionRoute: result.legionRoute,
            benchTarget,
            error: result.error,
        };
    },
    async runCorrectness(problem, problemRoot) {
        const startedAt = new Date().toISOString();
        if (!hasValkyrieSolver(problemRoot)) {
            return runResultFromReference(problem, 'valkyrie-node', { ok: false, stderr: 'solver not found' }, startedAt, 'solver not found');
        }
        const ref = await runVReference({ id: problem.id, title: problem.title });
        return runResultFromReference(problem, 'valkyrie-node', ref, startedAt);
    },
});
