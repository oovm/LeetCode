import { defineSolverAdapter } from '../factory.ts';
import { runResultFromReference } from '../shared/correctness-result.ts';
import { VALKYRIE_BENCH_PARAMS } from '../../planning/bench-params.ts';
import { hasValkyrieSolver, valkyrieNyarRunnerReady, valkyrieNyarSkipReason } from './valkyrie.ts';
import { benchValkyrieNyarProblem } from './bench.ts';
import { runNyarReference } from './ref.ts';

export const valkyrieNyarAdapter = defineSolverAdapter({
    implementationId: 'valkyrie-nyar',
    hasSolver: hasValkyrieSolver,
    runnerReady: valkyrieNyarRunnerReady,
    blockedReason: valkyrieNyarSkipReason,
    collectEnvironment: async () => ({
        language: 'valkyrie-nyar' as const,
        lane: 'nyar' as const,
        targetPolicy: 'lane-explicit' as const,
        runnerReady: valkyrieNyarRunnerReady(),
        skipReason: valkyrieNyarSkipReason(),
        // bench 实际参数以 VALKYRIE_BENCH_PARAMS 为准（与 benchValkyrieNyarProblem 默认值同源），不再伪造
        ...VALKYRIE_BENCH_PARAMS,
        host: {
            platform: process.platform,
            arch: process.arch,
            osRelease: '',
            nodeVersion: process.version,
        },
        legionVersion: null,
        legionRoute: null,
    }),
    async benchProblem(problem) {
        const result = await benchValkyrieNyarProblem(problem);
        // benchTarget 回传本次 bench 实际使用的 lane 计划 canonical triple
        return {
            compileMs: result.vCompileMs,
            runtimeMs: result.vRuntimeMs,
            legionRoute: result.legionRoute,
            benchTarget: result.target ?? undefined,
            error: result.error,
        };
    },
    async runCorrectness(problem, problemRoot) {
        const startedAt = new Date().toISOString();
        if (!hasValkyrieSolver(problemRoot)) {
            return runResultFromReference(problem, 'valkyrie-nyar', { ok: false, stderr: 'solver not found' }, startedAt, 'solver not found');
        }
        const ref = await runNyarReference(problem);
        return runResultFromReference(problem, 'valkyrie-nyar', ref, startedAt);
    },
});
