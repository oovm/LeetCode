import { mkdirSync } from 'node:fs';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { formatLegionError, legionBuildNative, legionTest } from './valkyrie.ts';
import { runVReference, vBuildDir } from './ref.ts';

export type ValkyrieMatrixRow = {
    id: string;
    buildStatus: number;
    testStatus: number;
    buildRoute: string | null;
    testRoute: string | null;
    buildError: string | null;
    testError: string | null;
    runtimeOk: boolean;
    runtimeError: string | null;
};

export async function probeValkyrieProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieMatrixRow> {
    const outDir = vBuildDir(problem);
    mkdirSync(outDir, { recursive: true });
    const build = legionBuildNative(projectPath, outDir);
    const test = legionTest(projectPath);

    let runtimeOk = false;
    let runtimeError: string | null = null;
    if (build.status === 0) {
        const ref = await runVReference(problem);
        runtimeOk = ref.ok;
        runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests 未通过';
    }

    return {
        id: problem.id,
        buildStatus: build.status,
        testStatus: test.status,
        buildRoute: build.route,
        testRoute: test.route,
        buildError: build.status === 0 ? null : formatLegionError('legion build --target node', build),
        testError: test.status === 0 ? null : formatLegionError('legion test --target node', test),
        runtimeOk,
        runtimeError,
    };
}

/** 绿：能编且 `run_v_solver` 全量 `metadata.tests` 通过（拒绝空壳 wasm）。 */
export function isValkyrieGreen(row: ValkyrieMatrixRow): boolean {
    return row.buildStatus === 0 && row.runtimeOk;
}
