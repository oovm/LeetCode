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

const NYAR_VM_ROOT = process.env.NYAR_VM_ROOT ?? join(LEETCODE_ROOT, '..', 'nyar-vm.rs');
const runner = createLegionBenchmarkRunner();

export type LegionOutcome = LegionSpawnResult;

export const NYAR_BUILD_TARGET = OVM_BUILD_TARGET;

export function nyarBuildDir(problem: ProblemDefinition): string {
    return join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-nyar`);
}

export function locateNyarVmBinary(): string | null {
    const override = process.env.NYAR_VM?.trim();
    if (override && existsSync(override)) return override;
    const base = process.platform === 'win32' ? 'nyar-vm.exe' : 'nyar-vm';
    for (const profile of ['release', 'debug'] as const) {
        const candidate = join(NYAR_VM_ROOT, 'projects', 'nyar.rs', 'target', profile, base);
        if (existsSync(candidate)) return candidate;
    }
    return null;
}

export function valkyrieNyarRunnerReady(): boolean {
    return legionNativeReady() && locateNyarVmBinary() !== null;
}

export function valkyrieNyarSkipReason(): string | null {
    const legion = legionNativeSkipReason();
    if (legion) return legion;
    if (!locateNyarVmBinary()) {
        return 'nyar-vm ????cargo build -p nyar-vm @ nyar-vm.rs/projects/nyar.rs?';
    }
    return null;
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
