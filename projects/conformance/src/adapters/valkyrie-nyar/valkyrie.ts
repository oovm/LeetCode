import { existsSync } from 'node:fs';
import { join } from 'node:path';

import {
    createHostRunner,
    legionBuildOutcomeToSpawnResult,
    locateNativeCollect,
    type LegionBuildOutcome,
    type VccCliSpawnResult,
} from '@valkyrie-language/vcc';
import type { ProblemDefinition } from '../../catalog/index.ts';
import { LEETCODE_ROOT, LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import {
    createBenchmarkRunner,
    formatLegionCliError,
    parseLegionBenchTable,
    type LegionBenchRow,
} from '@valkyrie-language/vcc/benchmark';
import { wasmCollectReady } from '@valkyrie-language/vcc/testing';

const VALKYRIE_RS_ROOT = process.env.VALKYRIE_RS_ROOT ?? join(LEETCODE_ROOT, '..', 'valkyrie.rs');
const NYAR_VM_ROOT = process.env.NYAR_VM_ROOT ?? join(LEETCODE_ROOT, '..', 'nyar-vm.rs');

export const VALKYRIE_WASM_COLLECT_DIR = join(VALKYRIE_RS_ROOT, 'projects', 'packages', 'vcc-unknown-wasm32');

const WASM_COLLECT = '@valkyrie-language/vcc-unknown-wasm32';
const WASM_ENTRY = 'legion.mjs';

export const legionHost = createHostRunner({
    wasmCollect: WASM_COLLECT,
    wasmEntry: WASM_ENTRY,
});

const runner = createBenchmarkRunner({
    valkyrieRsRoot: VALKYRIE_RS_ROOT,
    wasmCollectDir: VALKYRIE_WASM_COLLECT_DIR,
    host: legionHost,
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
    return (locateNativeCollect() !== null || wasmCollectReady(WASM_COLLECT, WASM_ENTRY)) && locateNyarVmBinary() !== null;
}

export function valkyrieNyarSkipReason(): string | null {
    if (!locateNativeCollect() && !wasmCollectReady(WASM_COLLECT, WASM_ENTRY)) {
        return 'VCC 未就绪：path link `@valkyrie-language/vcc-win32-x64`（`node scripts/build.mjs napi`）或 wasm collect';
    }
    if (!locateNyarVmBinary()) {
        return 'nyar-vm CLI 未找到（在 nyar-vm.rs 执行 cargo build -p nyar-vm 或设置 NYAR_VM）';
    }
    return null;
}

export { hasValkyrieSolver, valkyrieSolverPath } from '../valkyrie-node/valkyrie.ts';

export function spawnLegion(argv: string[]): LegionOutcome {
    return legionHost.spawnCli(argv);
}

export function legionBuildNyar(projectDir: string, outputDir: string): LegionOutcome {
    const outcome = legionHost.buildProject(projectDir, NYAR_BUILD_TARGET, outputDir);
    if ('ok' in outcome) {
        return legionBuildOutcomeToSpawnResult(outcome as LegionBuildOutcome);
    }
    return outcome;
}

export function legionTestNyar(projectDir: string): LegionOutcome {
    return legionHost.spawnCli(['test', projectDir, '--target', NYAR_BUILD_TARGET]);
}

export function legionRunNyar(projectDir: string, outputDir: string): LegionOutcome {
    return legionHost.spawnCli(['run', projectDir, '--target', NYAR_BUILD_TARGET, '-o', outputDir]);
}

export type ParsedBenchRow = LegionBenchRow;

export { parseLegionBenchTable };

export function formatLegionError(label: string, outcome: LegionOutcome): string {
    return formatLegionCliError(label, outcome);
}

export { runner as valkyrieNyarBenchmarkRunner };
