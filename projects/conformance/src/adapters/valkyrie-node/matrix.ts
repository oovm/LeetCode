import { mkdirSync } from 'node:fs';

import { NODE_WASM_TARGET, isArtifactCacheFresh } from '@valkyrie-language/vcc/testing';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { formatLegionError, legionBuildNative, legionTest } from './valkyrie.ts';
import { runVReference, resolveVBuildArtifacts, vArtifactDir, vBuildDir } from './ref.ts';

export type ValkyrieMatrixRow = {
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

export async function probeValkyrieProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieMatrixRow> {
    const outDir = vBuildDir(problem);
    mkdirSync(outDir, { recursive: true });
    const build = legionBuildNative(projectPath, outDir);
    const test = legionTest(projectPath);

    const artifactDir = vArtifactDir(problem);
    const freshness = isArtifactCacheFresh(artifactDir, NODE_WASM_TARGET);

    let runtimeOk = false;
    let runtimeError: string | null = null;
    if (build.status === 0) {
        if (!freshness.fresh) {
            runtimeOk = false;
            runtimeError = freshness.reason ?? 'build 产物缺少可信 execution manifest';
        } else {
            const artifacts = resolveVBuildArtifacts(problem);
            if (!artifacts) {
                runtimeOk = false;
                runtimeError = 'build 成功但未解析到 wasm/js 产物';
            } else {
                const ref = await runVReference(problem, { artifacts, buildRoute: build.route });
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
        buildError: build.status === 0 ? null : formatLegionError('legion build --target node', build),
        testError: test.status === 0 ? null : formatLegionError('legion test --target node', test),
        manifestFresh: freshness.fresh,
        manifestError: freshness.fresh ? null : freshness.reason,
        runtimeOk,
        runtimeError,
    };
}

/** 绿：能编、`legion test` 通过、manifest 新鲜且 `run_v_solver` 全量 `metadata.tests` 通过。 */
export function isValkyrieGreen(row: ValkyrieMatrixRow): boolean {
    return row.buildStatus === 0 && row.testStatus === 0 && row.manifestFresh && row.runtimeOk;
}
