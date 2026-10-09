import { mkdirSync } from 'node:fs';

import { NYAR_VM_TARGET, isArtifactCacheFresh, resolveArtifactDir } from '@valkyrie-language/vcc/testing';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { formatLegionError, legionBuildNyar, legionTestNyar, nyarBuildDir } from './valkyrie.ts';
import { runNyarReference, resolveNyarBuildArtifacts } from './ref.ts';

export type ValkyrieNyarMatrixRow = {
    id: string;
    buildStatus: number;
    testStatus: number;
    buildRoute: string | null;
    testRoute: string | null;
    buildError: string | null;
    testError: string | null;
    manifestFresh: boolean;
    manifestError: string | null;
    runtimeOk: boolean;
    runtimeError: string | null;
};

export async function probeValkyrieNyarProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieNyarMatrixRow> {
    const outDir = nyarBuildDir(problem);
    mkdirSync(outDir, { recursive: true });
    const build = legionBuildNyar(projectPath, outDir);
    const test = legionTestNyar(projectPath);

    const artifactDir = resolveArtifactDir(outDir, NYAR_VM_TARGET);
    const freshness = isArtifactCacheFresh(artifactDir, NYAR_VM_TARGET);

    let runtimeOk = false;
    let runtimeError: string | null = null;
    if (build.status === 0) {
        if (!freshness.fresh) {
            runtimeOk = false;
            runtimeError = freshness.reason ?? 'build 产物缺少可信 execution manifest';
        } else {
            const artifacts = resolveNyarBuildArtifacts(problem);
            if (!artifacts) {
                runtimeOk = false;
                runtimeError = 'build 成功但未解析到 .nyar 产物';
            } else {
                const ref = await runNyarReference(problem, { artifacts, buildRoute: build.route });
                runtimeOk = ref.ok;
                runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests 未通过';
            }
        }
    }

    return {
        id: problem.id,
        buildStatus: build.status,
        testStatus: test.status,
        buildRoute: build.route,
        testRoute: test.route,
        buildError: build.status === 0 ? null : formatLegionError('legion build --target nyar', build),
        testError: test.status === 0 ? null : formatLegionError('legion test --target nyar', test),
        manifestFresh: freshness.fresh,
        manifestError: freshness.fresh ? null : freshness.reason,
        runtimeOk,
        runtimeError,
    };
}

/** 绿：能编、`legion test` 通过、manifest 新鲜且 `run_nyar_solver` 全量 `metadata.tests` 通过。 */
export function isValkyrieNyarGreen(row: ValkyrieNyarMatrixRow): boolean {
    return row.buildStatus === 0 && row.testStatus === 0 && row.manifestFresh && row.runtimeOk;
}
