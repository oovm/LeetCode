import { existsSync } from 'node:fs';
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
import { LEETCODE_ROOT, LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';

const runner = createLegionBenchmarkRunner();

export type LegionOutcome = LegionSpawnResult;

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

export function legionBuildNyar(projectDir: string, outputDir: string): LegionOutcome {
    return legionBuildProject(projectDir, NYAR_BUILD_TARGET, outputDir);
}

export function legionTestNyar(projectDir: string): LegionOutcome {
    return legionTestProject(projectDir, NYAR_BUILD_TARGET);
}

export type ParsedBenchRow = LegionBenchRow;
export { parseLegionBenchTable };

export function formatLegionError(label: string, outcome: LegionOutcome): string {
    return formatLegionCliError(label, outcome);
}

export { runner as valkyrieNyarBenchmarkRunner };
