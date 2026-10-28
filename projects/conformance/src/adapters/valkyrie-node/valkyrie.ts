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
import { VALKYRIE_NODE } from './config.ts';

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
        if (text.length === 0) return 'solution.v ??';
        if (text.startsWith('# ??')) return 'solution.v ?????';
        return null;
    } catch {
        return 'solution.v ??';
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

export function legionBuild(projectDir: string, outputDir: string): LegionOutcome {
    return legionBuildProject(projectDir, VALKYRIE_NODE.compileTargetDefault, outputDir);
}

export const legionBuildNative = legionBuild;

export function legionTest(projectDir: string): LegionOutcome {
    return legionTestProject(projectDir, VALKYRIE_NODE.compileTargetDefault);
}

export type ParsedBenchRow = LegionBenchRow;
export { parseLegionBenchTable };

export function legionBench(projectDir: string, runs = 3) {
    return runner.benchProject(projectDir, { runs, target: VALKYRIE_NODE.benchCompileTarget });
}

export function formatLegionError(label: string, outcome: LegionOutcome): string {
    return formatLegionCliError(label, outcome);
}

export { runner as valkyrieBenchmarkRunner };
