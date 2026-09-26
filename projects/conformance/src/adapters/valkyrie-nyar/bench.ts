import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { median } from '@valkyrie-language/vcc/benchmark';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir, valkyrieProjectDir } from '../../catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import { VALKYRIE_BENCH_PARAMS } from '../../planning/bench-params.ts';
import { ensureNyarBuild, resolveNyarBuildArtifacts, nyarInvokeBlockedReason, runNyarSolverOnce } from './ref.ts';
import { loadMetadata } from './ref.ts';
import {
    NYAR_BUILD_TARGET,
    formatLegionError,
    legionBuildNyar,
    valkyrieNyarRunnerReady,
    valkyrieNyarSkipReason,
} from './valkyrie.ts';

export type ValkyrieNyarBenchResult = {
    vCompileMs: number | null;
    vRuntimeMs: number | null;
    legionRoute: string | null;
    error: string | null;
};

/** 外部基准：对 `legion build --target nyar` 计时；运行时分对 `metadata.tests` 循环取中位数。 */
export async function benchValkyrieNyarProblem(
    problem: ProblemDefinition,
    compileRuns = VALKYRIE_BENCH_PARAMS.compileRuns,
    warmup = VALKYRIE_BENCH_PARAMS.warmup,
): ValkyrieNyarBenchResult {
    if (!valkyrieNyarRunnerReady()) {
        return {
            vCompileMs: null,
            vRuntimeMs: null,
            legionRoute: null,
            error: valkyrieNyarSkipReason(),
        };
    }

    const projectDir = valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    const outDir = join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-nyar`);
    mkdirSync(outDir, { recursive: true });

    let legionRoute: string | null = null;

    for (let i = 0; i < warmup; i++) {
        const warm = legionBuildNyar(projectDir, outDir);
        legionRoute = warm.route;
        if (warm.status !== 0) {
            return {
                vCompileMs: null,
                vRuntimeMs: null,
                legionRoute,
                error: formatLegionError('legion build --target nyar', warm),
            };
        }
    }

    const compileSamples: number[] = [];
    for (let i = 0; i < compileRuns; i++) {
        const start = performance.now();
        const build = legionBuildNyar(projectDir, outDir);
        legionRoute = build.route;
        if (build.status !== 0) {
            return {
                vCompileMs: null,
                vRuntimeMs: null,
                legionRoute,
                error: formatLegionError('legion build --target nyar', build),
            };
        }
        compileSamples.push(performance.now() - start);
    }

    let vRuntimeMs: number | null = null;
    let runtimeError: string | null = null;

    const buildError = ensureNyarBuild(problem, projectDir);
    if (buildError) {
        runtimeError = buildError;
    } else {
        const artifacts = resolveNyarBuildArtifacts(problem);
        const problemRoot = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
        if (!artifacts) {
            runtimeError = 'legion build --target nyar 产物缺失';
        } else {
            const { invoke } = loadMetadata(problemRoot);
            const entry = invoke.valkyrie ?? invoke.typescript;
            const blocked = nyarInvokeBlockedReason(artifacts.nyarPath, entry);
            if (blocked) {
                runtimeError = blocked;
            } else {
                const runtimeSamples: number[] = [];
                const runtimeRuns = Math.max(1, VALKYRIE_BENCH_PARAMS.warmup > 0 ? 3 : 1);
                for (let i = 0; i < runtimeRuns; i++) {
                    const start = performance.now();
                    try {
                        await runNyarSolverOnce(problemRoot);
                        runtimeSamples.push(performance.now() - start);
                    } catch (err) {
                        runtimeError = String(err);
                        break;
                    }
                }
                if (!runtimeError && runtimeSamples.length > 0) {
                    vRuntimeMs = median(runtimeSamples);
                }
            }
        }
    }

    return {
        vCompileMs: median(compileSamples),
        vRuntimeMs,
        legionRoute,
        error: runtimeError,
    };
}
