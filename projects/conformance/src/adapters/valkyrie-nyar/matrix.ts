import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { NYAR_VM_TARGET, isArtifactCacheFresh, resolveArtifactDir } from '@valkyrie-language/vcc/testing';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { readMatrixManifestAudit } from '../shared/matrix-manifest-audit.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import { valkyrieSolverBlockedReason } from '../valkyrie-node/valkyrie.ts';
import { formatLegionError, legionBuildNyar, legionTestNyar, nyarBuildDir } from './valkyrie.ts';
import { runNyarReference, resolveNyarBuildArtifacts } from './ref.ts';

export type ValkyrieNyarMatrixRow = {
    id: string;
    target: 'nyar-unknown-unknown-managed';
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

function blockedNyarRow(problem: ProblemDefinition, solverNote: string): ValkyrieNyarMatrixRow {
    return {
        id: problem.id,
        target: 'nyar-unknown-unknown-managed',
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
}

export async function probeValkyrieNyarProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieNyarMatrixRow> {
    const problemRoot = join(projectPath, '..', '..');
    const solverNote = valkyrieSolverBlockedReason(problemRoot);
    if (solverNote) {
        return blockedNyarRow(problem, solverNote);
    }

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

    const manifestAudit = readMatrixManifestAudit(artifactDir);
    const row: ValkyrieNyarMatrixRow = {
        id: problem.id,
        target: 'nyar-unknown-unknown-managed',
        buildStatus: build.status,
        testStatus: test.status,
        buildRoute: build.route,
        testRoute: test.route,
        buildError: build.status === 0 ? null : formatLegionError('legion build --target nyar', build),
        testError: test.status === 0 ? null : formatLegionError('legion test --target nyar', test),
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

/** 绿：能编、`legion test` 通过、manifest 新鲜且 `run_nyar_solver` 全量 `metadata.tests` 通过。 */
export function isValkyrieNyarGreen(row: ValkyrieNyarMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
