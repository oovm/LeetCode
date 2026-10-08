import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
    createHostRunner,
    legionBuildOutcomeToSpawnResult,
    locateNativeCollect,
    type LegionBuildOutcome,
    type VccCliSpawnResult,
} from '@valkyrie-language/vcc';
import { LEETCODE_ROOT } from '../../domain/paths.ts';
import {
    createBenchmarkRunner,
    formatLegionCliError,
    parseLegionBenchTable,
    WASM_NODE_BENCH_TARGET,
    type LegionBenchRow,
} from '@valkyrie-language/vcc/benchmark';
import { wasmCollectReady } from '@valkyrie-language/vcc/testing';

const VALKYRIE_RS_ROOT = process.env.VALKYRIE_RS_ROOT ?? join(LEETCODE_ROOT, '..', 'valkyrie.rs');

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

export function valkyrieSolverPath(problemRoot: string): string {
    return join(problemRoot, 'solvers', 'valkyrie', 'solution.v');
}

/** 基准只跑非空且未标 `# 阻塞` 的 `solution.v`。 */
export function hasValkyrieSolver(problemRoot: string): boolean {
    try {
        const text = readFileSync(valkyrieSolverPath(problemRoot), 'utf8').trim();
        return text.length > 0 && !text.startsWith('# 阻塞');
    } catch {
        return false;
    }
}

export function valkyrieRunnerReady(): boolean {
    return runner.ready();
}

/** 题级 `legion build -o` 经 path link 的 VCC N-API（或 wasm collect fallback）。 */
export function valkyrieNativeRunnerReady(): boolean {
    return locateNativeCollect() !== null || wasmCollectReady(WASM_COLLECT, WASM_ENTRY);
}

export function valkyrieNativeSkipReason(): string | null {
    if (valkyrieNativeRunnerReady()) {
        return null;
    }
    return 'VCC 未就绪：path link `@valkyrie-language/vcc-win32-x64`（`node scripts/build.mjs napi`）或 wasm collect（`node scripts/build.mjs capability`）';
}

export function valkyrieSkipReason(): string | null {
    return runner.skipReason();
}

export function spawnLegion(argv: string[]): LegionOutcome {
    return legionHost.spawnCli(argv);
}

export function legionBuild(projectDir: string, outputDir: string): LegionOutcome {
    const outcome = legionHost.buildProject(projectDir, 'node', outputDir);
    if ('ok' in outcome) {
        return legionBuildOutcomeToSpawnResult(outcome as LegionBuildOutcome);
    }
    return outcome;
}

export function legionBuildNative(projectDir: string, outputDir: string): LegionOutcome {
    return legionBuild(projectDir, outputDir);
}

/** `spy` 等诊断子命令走 VCC N-API 宿主（wasm collect 无完整 CLI）。 */
export function spawnLegionSpy(argv: string[]): LegionOutcome {
    return legionHost.spawnCli(argv);
}

export function legionTest(projectDir: string): LegionOutcome {
    return legionHost.spawnCli(['test', projectDir, '-t', 'node']);
}

export type ParsedBenchRow = LegionBenchRow;

export { parseLegionBenchTable };

export function legionBench(projectDir: string, runs = 3): { outcome: LegionOutcome; rows: ParsedBenchRow[] } {
    const result = runner.benchProject(projectDir, { runs, target: WASM_NODE_BENCH_TARGET });
    return { outcome: result.outcome, rows: result.rows };
}

export function formatLegionError(label: string, outcome: LegionOutcome): string {
    return formatLegionCliError(label, outcome);
}

export { runner as valkyrieBenchmarkRunner };
