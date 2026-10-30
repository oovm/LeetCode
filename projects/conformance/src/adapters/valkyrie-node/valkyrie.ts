import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
    createLegionBenchmarkRunner,
    formatLegionCliError,
    legionBuildProject,
    legionNativeReady,
    legionNativeSkipReason,
    legionSpawn,
    legionTestProject,
    parseLegionBenchTable,
    type LegionBenchRow,
    type LegionSpawnResult,
} from '@nyar/valkyrie';
import { LEETCODE_ROOT } from '../../domain/paths.ts';
import type { CompileTargetPlan } from '../shared/compile-target-plan.ts';

const runner = createLegionBenchmarkRunner();

export type LegionOutcome = LegionSpawnResult;

export function valkyrieSolverPath(problemRoot: string): string {
    return join(problemRoot, 'solvers', 'valkyrie', 'solution.v');
}

export function hasValkyrieSolver(problemRoot: string): boolean {
    try {
        readFileSync(valkyrieSolverPath(problemRoot), 'utf8');
        return true;
    } catch {
        return false;
    }
}

export function valkyrieSolverBlockedReason(problemRoot: string): string | null {
    try {
        const text = readFileSync(valkyrieSolverPath(problemRoot), 'utf8').trim();
        if (text.length === 0) return 'solution.v 为空';
        if (text.startsWith('# ')) return 'solution.v 仅占位';
        return null;
    } catch {
        return 'solution.v 缺失';
    }
}

export function valkyrieRunnerReady(): boolean {
    return runner.ready();
}

export function valkyrieNativeRunnerReady(): boolean {
    return legionNativeReady();
}

export function valkyrieNativeSkipReason(): string | null {
    return legionNativeSkipReason();
}

export function valkyrieSkipReason(): string | null {
    return runner.skipReason();
}

export function spawnLegion(argv: string[]): LegionOutcome {
    return legionSpawn(argv);
}

/**
 * 按计划对象调用 legion build。
 * compile target 的唯一来源是 `CompileTargetPlan`；这里不再解析 manifest。
 */
export function legionBuild(plan: CompileTargetPlan, outputDir: string): LegionOutcome {
    return legionBuildProject(plan.solverDir, plan.canonicalTarget, outputDir);
}

export const legionBuildNative = legionBuild;

/**
 * 按计划对象调用 legion test。
 */
export function legionTest(plan: CompileTargetPlan): LegionOutcome {
    return legionTestProject(plan.solverDir, plan.canonicalTarget);
}

export type ParsedBenchRow = LegionBenchRow;
export { parseLegionBenchTable };

/**
 * bench 复用同一计划对象，避免每次采样重新解析 target。
 */
export function legionBench(plan: CompileTargetPlan, runs = 3) {
    return runner.benchProject(plan.solverDir, { runs, target: plan.canonicalTarget });
}

export function formatLegionError(label: string, outcome: LegionOutcome): string {
    return formatLegionCliError(label, outcome);
}

export { runner as valkyrieBenchmarkRunner };
