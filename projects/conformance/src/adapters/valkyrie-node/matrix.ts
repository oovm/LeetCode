import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { NODE_WASM_TARGET, isArtifactCacheFresh } from '@valkyrie-language/vcc/testing';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { readMatrixManifestAudit } from '../shared/matrix-manifest-audit.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import { formatLegionError, legionBuildNative, legionTest, valkyrieSolverBlockedReason } from './valkyrie.ts';
import { runVReference, resolveVBuildArtifacts, vArtifactDir, vBuildDir } from './ref.ts';

export type ValkyrieMatrixRow = {
    id: string;
    target: 'wasm32-node-unknown-wasm';
    buildStatus: number;
    testStatus: number;
    buildRoute: string | null;
    testRoute: string | null;
    buildError: string | null;
    testError: string | null;
    manifestFresh: boolean;
    manifestError: string | null;
    manifestSchemaVersion: number | null;
    semanticClosureHash: string | null;
    canonicalSurfaceHash: string | null;
    hostProviderBindingHash: string | null;
    runtimeOk: boolean;
    runtimeError: string | null;
    solverNote: string | null;
    green: boolean;
};

function blockedWasmRow(problem: ProblemDefinition, solverNote: string): ValkyrieMatrixRow {
    const row: ValkyrieMatrixRow = {
        id: problem.id,
        target: 'wasm32-node-unknown-wasm',
        buildStatus: 1,
        testStatus: 1,
        buildRoute: null,
        testRoute: null,
        buildError: solverNote,
        testError: solverNote,
        manifestFresh: false,
        manifestError: solverNote,
        manifestSchemaVersion: null,
        semanticClosureHash: null,
        canonicalSurfaceHash: null,
        hostProviderBindingHash: null,
        runtimeOk: false,
        runtimeError: solverNote,
        solverNote,
        green: false,
    };
    return row;
}

export async function probeValkyrieProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieMatrixRow> {
    const problemRoot = join(projectPath, '..', '..');
    const solverNote = valkyrieSolverBlockedReason(problemRoot);
    if (solverNote) {
        return blockedWasmRow(problem, solverNote);
    }

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

    const manifestAudit = readMatrixManifestAudit(artifactDir);
    const row: ValkyrieMatrixRow = {
        id: problem.id,
        target: 'wasm32-node-unknown-wasm',
        buildStatus: build.status,
        testStatus: test.status,
        buildRoute: build.route,
        testRoute: test.route,
        buildError: build.status === 0 ? null : formatLegionError('legion build --target node', build),
        testError: test.status === 0 ? null : formatLegionError('legion test --target node', test),
        manifestFresh: freshness.fresh,
        manifestError: freshness.fresh ? null : freshness.reason,
        manifestSchemaVersion: manifestAudit.manifestSchemaVersion,
        semanticClosureHash: manifestAudit.semanticClosureHash,
        canonicalSurfaceHash: manifestAudit.canonicalSurfaceHash,
        hostProviderBindingHash: manifestAudit.hostProviderBindingHash,
        runtimeOk,
        runtimeError,
        solverNote: null,
        green: false,
    };
    row.green = isMatrixRowGreen(row);
    return row;
}

/** 绿：能编、`legion test` 通过、manifest 新鲜且 `run_v_solver` 全量 `metadata.tests` 通过。 */
export function isValkyrieGreen(row: ValkyrieMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
