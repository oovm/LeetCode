import { existsSync } from 'node:fs';
import { join } from 'node:path';

import type { VccCliSpawnResult } from '@valkyrie-language/vcc';
import type { ProblemDefinition } from '../../catalog/index.ts';
import { LEETCODE_ROOT, LEETCODE_ROOT_FROM_PACKAGE, preferStagedLegionBin } from '../../domain/paths.ts';
import {
    createBenchmarkRunner,
    formatLegionCliError,
    parseLegionBenchTable,
    type LegionBenchRow,
} from '@valkyrie-language/vcc/benchmark';
import { locateNativeLegionBinary, spawnNativeLegion } from '@valkyrie-language/vcc/testing';

preferStagedLegionBin();

const VALKYRIE_RS_ROOT = process.env.VALKYRIE_RS_ROOT ?? join(LEETCODE_ROOT, '..', 'valkyrie.rs');
const NYAR_VM_ROOT = process.env.NYAR_VM_ROOT ?? join(LEETCODE_ROOT, '..', 'nyar-vm.rs');

export const VALKYRIE_WASM_COLLECT_DIR = join(VALKYRIE_RS_ROOT, 'projects', 'packages', 'vcc-unknown-wasm32');

const runner = createBenchmarkRunner({
    valkyrieRsRoot: VALKYRIE_RS_ROOT,
    wasmCollectDir: VALKYRIE_WASM_COLLECT_DIR,
});

export type LegionOutcome = VccCliSpawnResult;

/** Nyar VM 目标别名（与 `CanonicalTarget::parse("nyar")` 对齐）。 */
export const NYAR_BUILD_TARGET = 'nyar';

export function nyarBuildDir(problem: ProblemDefinition): string {
    return join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-nyar`);
}

/** 解析本机 `nyar-vm` CLI（release 优先，其次 debug；可用 `NYAR_VM` 覆盖）。 */
export function locateNyarVmBinary(): string | null {
    const override = process.env.NYAR_VM?.trim();
    if (override && existsSync(override)) {
        return override;
    }
    const base = process.platform === 'win32' ? 'nyar-vm.exe' : 'nyar-vm';
    for (const profile of ['release', 'debug'] as const) {
        const candidate = join(NYAR_VM_ROOT, 'target', profile, base);
        if (existsSync(candidate)) {
            return candidate;
        }
    }
    return null;
}

export function valkyrieNyarRunnerReady(): boolean {
    return locateNativeLegionBinary(VALKYRIE_RS_ROOT) !== null && locateNyarVmBinary() !== null;
}

export function valkyrieNyarSkipReason(): string | null {
    if (!locateNativeLegionBinary(VALKYRIE_RS_ROOT)) {
        return 'native vcc 未找到（pnpm stage:vcc，或 cargo build -p legion → target/*/vcc 后设置 VCC_BIN）';
    }
    if (!locateNyarVmBinary()) {
        return 'nyar-vm CLI 未找到（在 nyar-vm.rs 执行 cargo build -p nyar-vm 或设置 NYAR_VM）';
    }
    return null;
}

export { hasValkyrieSolver, valkyrieSolverPath } from '../valkyrie-node/valkyrie.ts';

export function spawnLegion(argv: string[]): LegionOutcome {
    return runner.spawnLegion(argv);
}

function spawnNyarLegion(argv: string[]): LegionOutcome {
    return spawnNativeLegion(VALKYRIE_RS_ROOT, argv);
}

export function legionBuildNyar(projectDir: string, outputDir: string): LegionOutcome {
    return spawnNyarLegion(['build', projectDir, '--target', NYAR_BUILD_TARGET, '-o', outputDir]);
}

export function legionTestNyar(projectDir: string): LegionOutcome {
    return spawnNyarLegion(['test', projectDir, '--target', NYAR_BUILD_TARGET]);
}

export function legionRunNyar(projectDir: string, outputDir: string): LegionOutcome {
    return spawnNyarLegion(['run', projectDir, '--target', NYAR_BUILD_TARGET, '-o', outputDir]);
}

export type ParsedBenchRow = LegionBenchRow;

export { parseLegionBenchTable };

export function formatLegionError(label: string, outcome: LegionOutcome): string {
    return formatLegionCliError(label, outcome);
}

export { runner as valkyrieNyarBenchmarkRunner };
