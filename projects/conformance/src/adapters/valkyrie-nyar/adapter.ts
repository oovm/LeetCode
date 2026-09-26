import { NYAR_BUILD_TARGET } from './valkyrie.ts';
import { defineSolverAdapter } from '../factory.ts';
import { runResultFromReference } from '../shared/correctness-result.ts';
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
        benchTarget: NYAR_BUILD_TARGET,
        runnerReady: valkyrieNyarRunnerReady(),
        skipReason: valkyrieNyarSkipReason(),
        compileMetric: 'compile' as const,
        runtimeMetric: 'runtime' as const,
        runtimeStatus: valkyrieNyarRunnerReady() ? ('ready' as const) : ('blocked-stub-wasm' as const),
        aggregation: 'median' as const,
        compileRuns: 1,
        warmup: 0,
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
        const result = benchValkyrieNyarProblem(problem);
        return {
            compileMs: result.vCompileMs,
            runtimeMs: result.vRuntimeMs,
            legionRoute: result.legionRoute,
            benchTarget: NYAR_BUILD_TARGET,
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
