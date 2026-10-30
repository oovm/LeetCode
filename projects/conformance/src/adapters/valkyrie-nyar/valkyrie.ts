import { join } from 'node:path';

import {
    createLegionBenchmarkRunner,
    formatLegionCliError,
    legionBuildProject,
    legionNativeReady,
    legionNativeSkipReason,
    legionSpawn,
    legionTestProject,
    OVM_BUILD_TARGET,
    parseLegionBenchTable,
    type LegionBenchRow,
    type LegionSpawnResult,
} from '@nyar/valkyrie';
import type { ProblemDefinition } from '../../catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import type { CompileTargetPlan } from '../shared/compile-target-plan.ts';

const runner = createLegionBenchmarkRunner();

export type LegionOutcome = LegionSpawnResult;

/**
 * 旧 nyar lane 显式指定的编译目标。
 *
 * 这是 lane 自身的定义（`ovm` = 旧 managed 运行器 lane），不是 manifest 声明的 `wasm`；
 * 它不是 `0.0.x` 的交付 lane，因此报告必须与 wasm lane 分开计数。
 */
export const NYAR_BUILD_TARGET = OVM_BUILD_TARGET;

export function nyarBuildDir(problem: ProblemDefinition): string {
    return join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-nyar`);
}

export function valkyrieNyarRunnerReady(): boolean {
    return legionNativeReady();
}

export function valkyrieNyarSkipReason(): string | null {
    return legionNativeSkipReason();
}

export { hasValkyrieSolver, valkyrieSolverPath } from '../valkyrie-node/valkyrie.ts';

export function spawnLegion(argv: string[]): LegionOutcome {
    return legionSpawn(argv);
}

/**
 * 按 lane 计划调用 `legion build`。
 * compile target 的唯一来源是 `CompileTargetPlan`（lane-explicit），这里不再写死短名。
 */
export function legionBuildNyar(plan: CompileTargetPlan, outputDir: string): LegionOutcome {
    return legionBuildProject(plan.solverDir, plan.canonicalTarget, outputDir);
}

/**
 * 按 lane 计划调用 `legion test`。
 */
export function legionTestNyar(plan: CompileTargetPlan): LegionOutcome {
    return legionTestProject(plan.solverDir, plan.canonicalTarget);
}

export type ParsedBenchRow = LegionBenchRow;
export { parseLegionBenchTable };

export function formatLegionError(label: string, outcome: LegionOutcome): string {
    return formatLegionCliError(label, outcome);
}

export { runner as valkyrieNyarBenchmarkRunner };
