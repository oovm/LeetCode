import { mkdirSync } from 'node:fs';

import { median } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { problemDir, valkyrieProjectDir } from '../../catalog/index.ts';
import { VALKYRIE_BENCH_PARAMS } from '../../planning/bench-params.ts';
import { readArtifactEvidence } from '../shared/artifact-evidence.ts';
import {
    CompileTargetPlanError,
    resolveCompileTargetPlan,
    type CompileTargetPlan,
} from '../shared/compile-target-plan.ts';
import { benchVRuntimeProblem } from './runtime-bench.ts';
import { loadMetadata, resolveVBuildArtifacts, vBuildDir, wasmInvokeBlockedReason } from './ref.ts';
import { formatLegionError, legionBuild, valkyrieRunnerReady, valkyrieSkipReason } from './valkyrie.ts';

export type ValkyrieBenchResult = {
    vCompileMs: number | null;
    vRuntimeMs: number | null;
    legionRoute: string | null;
    /** 计划 canonical triple（唯一执行身份）；计划解析失败为 null。 */
    target: string | null;
    error: string | null;
};

/**
 * leetcode 的 V 基准：用同一 `CompileTargetPlan` 驱动 `legion build`，
 * 产物是 target 决定的 artifact，由 `run_v_solver.ts` 对 `metadata.tests` 计时。
 * 产物无法 invoke 时 `vRuntimeMs` 置 null，并在 `error` 里说明原因。
 */
export function benchValkyrieProblem(
    problem: ProblemDefinition,
    compileRuns = VALKYRIE_BENCH_PARAMS.compileRuns,
    warmup = VALKYRIE_BENCH_PARAMS.warmup,
): ValkyrieBenchResult {
    if (!valkyrieRunnerReady()) {
        return {
            vCompileMs: null,
            vRuntimeMs: null,
            legionRoute: null,
            target: null,
            error: valkyrieSkipReason(),
        };
    }

    let plan: CompileTargetPlan;
    try {
        plan = resolveCompileTargetPlan(valkyrieProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem));
    } catch (error) {
        const detail = error instanceof CompileTargetPlanError ? `${error.code}: ${error.message}` : String(error);
        return { vCompileMs: null, vRuntimeMs: null, legionRoute: null, target: null, error: detail };
    }

    const outDir = vBuildDir(problem);
    mkdirSync(outDir, { recursive: true });

    let legionRoute: string | null = null;

    for (let i = 0; i < warmup; i++) {
        const warm = legionBuild(plan, outDir);
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
        const build = legionBuild(plan, outDir);
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

    const artifacts = resolveVBuildArtifacts(problem);
    const evidence = readArtifactEvidence(outDir, plan);
    if (!artifacts) {
        runtimeError = 'legion build 产物缺失';
    } else if (!evidence.fresh) {
        runtimeError = evidence.reason ?? 'legion build 产物与计划不一致';
    } else {
        const problemRoot = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
        const { invoke } = loadMetadata(problemRoot);
        const entry = invoke.valkyrie ?? invoke.typescript;
        const blocked = wasmInvokeBlockedReason(artifacts.entry.legionWasm, entry);
        if (blocked) {
            runtimeError = blocked;
        } else {
            try {
                vRuntimeMs = benchVRuntimeProblem(problem);
            } catch (err) {
                runtimeError = String(err);
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
