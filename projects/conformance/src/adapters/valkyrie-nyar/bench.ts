import { mkdirSync } from 'node:fs';

import { median, resolveArtifactDir } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir, valkyrieProjectDir } from '../../catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import { VALKYRIE_BENCH_PARAMS } from '../../planning/bench-params.ts';
import { readArtifactEvidence } from '../shared/artifact-evidence.ts';
import {
    CompileTargetPlanError,
    resolveLaneTargetPlan,
    type CompileTargetPlan,
} from '../shared/compile-target-plan.ts';
import {
    ensureNyarBuild,
    resolveNyarBuildArtifacts,
    resolveNyarInvokeBlocker,
    runNyarSolverOnce,
} from './ref.ts';
import {
    NYAR_BUILD_TARGET,
    formatLegionError,
    legionBuildNyar,
    nyarBuildDir,
    valkyrieNyarRunnerReady,
    valkyrieNyarSkipReason,
} from './valkyrie.ts';

export type ValkyrieNyarBenchResult = {
    vCompileMs: number | null;
    vRuntimeMs: number | null;
    legionRoute: string | null;
    /** lane 计划 canonical triple（唯一执行身份）；计划解析失败为 null。 */
    target: string | null;
    error: string | null;
};

/**
 * 旧 nyar lane 基准：`legion build --target ovm` 的编译耗时 + `metadata.tests` 的运行耗时。
 * 计划对象只解析一次，产物不可 invoke 时 `vRuntimeMs` 置 null 并说明原因。
 */
export async function benchValkyrieNyarProblem(
    problem: ProblemDefinition,
    compileRuns = VALKYRIE_BENCH_PARAMS.compileRuns,
    warmup = VALKYRIE_BENCH_PARAMS.warmup,
): Promise<ValkyrieNyarBenchResult> {
    if (!valkyrieNyarRunnerReady()) {
        return {
            vCompileMs: null,
            vRuntimeMs: null,
            legionRoute: null,
            target: null,
            error: valkyrieNyarSkipReason(),
        };
    }

    let plan: CompileTargetPlan;
    try {
        plan = resolveLaneTargetPlan(valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem), NYAR_BUILD_TARGET);
    } catch (error) {
        const detail = error instanceof CompileTargetPlanError ? `${error.code}: ${error.message}` : String(error);
        return { vCompileMs: null, vRuntimeMs: null, legionRoute: null, target: null, error: detail };
    }

    const outDir = nyarBuildDir(problem);
    mkdirSync(outDir, { recursive: true });

    let legionRoute: string | null = null;

    for (let i = 0; i < warmup; i++) {
        const warm = legionBuildNyar(plan, outDir);
        legionRoute = warm.route;
        if (warm.status !== 0) {
            return {
                vCompileMs: null,
                vRuntimeMs: null,
                legionRoute,
                target: plan.canonicalTarget,
                error: formatLegionError(`legion build --target ${plan.canonicalTarget}`, warm),
            };
        }
    }

    const compileSamples: number[] = [];
    for (let i = 0; i < compileRuns; i++) {
        const start = performance.now();
        const build = legionBuildNyar(plan, outDir);
        legionRoute = build.route;
        if (build.status !== 0) {
            return {
                vCompileMs: null,
                vRuntimeMs: null,
                legionRoute,
                target: plan.canonicalTarget,
                error: formatLegionError(`legion build --target ${plan.canonicalTarget}`, build),
            };
        }
        compileSamples.push(performance.now() - start);
    }

    let vRuntimeMs: number | null = null;
    let runtimeError: string | null = null;

    const buildOutcome = ensureNyarBuild(problem, plan);
    if (buildOutcome.error) {
        runtimeError = buildOutcome.error;
    } else {
        const artifacts = resolveNyarBuildArtifacts(problem);
        const problemRoot = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
        const evidence = readArtifactEvidence(resolveArtifactDir(outDir, plan.canonicalTarget), plan);
        if (!artifacts) {
            runtimeError = 'legion build --target ovm 未产出 `.nyar` 入口';
        } else if (!evidence.fresh) {
            runtimeError = evidence.reason ?? 'legion build 产物与 lane 计划不一致';
        } else {
            const blocked = resolveNyarInvokeBlocker(problemRoot, artifacts.nyarPath);
            if (blocked) {
                runtimeError = blocked;
            } else {
                const runtimeSamples: number[] = [];
                const runtimeRuns = Math.max(1, VALKYRIE_BENCH_PARAMS.warmup > 0 ? 3 : 1);
                for (let i = 0; i < runtimeRuns; i++) {
                    const start = performance.now();
                    try {
                        await runNyarSolverOnce(problemRoot, {
                            artifacts,
                            buildRoute: buildOutcome.buildRoute,
                            compileTarget: plan.canonicalTarget,
                        });
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
        target: plan.canonicalTarget,
        error: runtimeError,
    };
}
