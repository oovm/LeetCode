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
import { resolveCompileTargetFromManifest } from './manifest.ts';

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
 * 从 solver 目录的 legion.von 解析 compile target，然后调用 legion build。
 * compile target 的**唯一来源**是 manifest —— 禁止任何默认值。
 */
export function legionBuild(projectDir: string, outputDir: string): LegionOutcome {
    const target = resolveCompileTargetFromManifest(projectDir);
    return legionBuildProject(projectDir, target, outputDir);
}

export const legionBuildNative = legionBuild;

/**
 * 从 solver 目录的 legion.von 解析 compile target，然后调用 legion test。
 */
export function legionTest(projectDir: string): LegionOutcome {
    const target = resolveCompileTargetFromManifest(projectDir);
    return legionTestProject(projectDir, target);
}

export type ParsedBenchRow = LegionBenchRow;
export { parseLegionBenchTable };

/**
 * bench 同样从 manifest 读 target。
 */
export function legionBench(projectDir: string, runs = 3) {
    const target = resolveCompileTargetFromManifest(projectDir);
    return runner.benchProject(projectDir, { runs, target });
}

export function formatLegionError(label: string, outcome: LegionOutcome): string {
    return formatLegionCliError(label, outcome);
}

export { runner as valkyrieBenchmarkRunner };
