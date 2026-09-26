import { mkdirSync } from 'node:fs';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { formatLegionError, legionBuildNyar, legionTestNyar, nyarBuildDir } from './valkyrie.ts';
import { runNyarReference } from './ref.ts';

export type ValkyrieNyarMatrixRow = {
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

export async function probeValkyrieNyarProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieNyarMatrixRow> {
    const outDir = nyarBuildDir(problem);
    mkdirSync(outDir, { recursive: true });
    const build = legionBuildNyar(projectPath, outDir);
    const test = legionTestNyar(projectPath);

    let runtimeOk = false;
    let runtimeError: string | null = null;
    if (build.status === 0) {
        const ref = await runNyarReference(problem);
        runtimeOk = ref.ok;
        runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests 未通过';
    }

    return {
        id: problem.id,
        buildStatus: build.status,
        testStatus: test.status,
        buildRoute: build.route,
        testRoute: test.route,
        buildError: build.status === 0 ? null : formatLegionError('legion build --target nyar', build),
        testError: test.status === 0 ? null : formatLegionError('legion test --target nyar', test),
        runtimeOk,
        runtimeError,
    };
}

/** 绿：能编且 `run_nyar_solver` 全量 `metadata.tests` 通过。 */
export function isValkyrieNyarGreen(row: ValkyrieNyarMatrixRow): boolean {
    return row.buildStatus === 0 && row.runtimeOk;
}
