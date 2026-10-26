import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { isArtifactCacheFreshForBuild, resolveArtifactDir } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { readMatrixManifestAudit } from '../shared/matrix-manifest-audit.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import { emptySolverCaseStats, type SolverCaseStats } from '../shared/solver-case-stats.ts';
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
    testCaseTotal: number;
    testCasePass: number;
    testCaseFail: number;
    firstFailureIndex: number | null;
    firstFailure: string | null;
    solverNote: string | null;
    green: boolean;
};

function withCaseStats(row: ValkyrieNyarMatrixRow, stats: SolverCaseStats): ValkyrieNyarMatrixRow {
    row.testCaseTotal = stats.testCaseTotal;
    row.testCasePass = stats.testCasePass;
    row.testCaseFail = stats.testCaseFail;
    row.firstFailureIndex = stats.firstFailureIndex;
    row.firstFailure = stats.firstFailure;
    return row;
}

function blockedNyarRow(problem: ProblemDefinition, solverNote: string): ValkyrieNyarMatrixRow {
    return withCaseStats({
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
        testCaseTotal: 0,
        testCasePass: 0,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: solverNote,
        solverNote,
        green: false,
    }, emptySolverCaseStats(solverNote));
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

    const artifactDir = resolveArtifactDir(outDir, 'ovm');
    const freshness = isArtifactCacheFreshForBuild(artifactDir);

    let runtimeOk = false;
    let runtimeError: string | null = null;
    let caseStats = emptySolverCaseStats();
    if (build.status === 0) {
        if (!freshness.fresh) {
            runtimeOk = false;
            runtimeError = freshness.reason ?? 'build ?????????? execution manifest';
            caseStats = emptySolverCaseStats(runtimeError);
        } else {
            const artifacts = resolveNyarBuildArtifacts(problem);
            if (!artifacts) {
                runtimeOk = false;
                runtimeError = 'build ?????¦Ä?????? .nyar ????';
                caseStats = emptySolverCaseStats(runtimeError);
            } else {
                const ref = await runNyarReference(problem, { artifacts, buildRoute: build.route });
                runtimeOk = ref.ok;
                runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests ¦Ä???';
                caseStats = ref.caseStats;
            }
        }
    }

    const manifestAudit = readMatrixManifestAudit(artifactDir);
    const row: ValkyrieNyarMatrixRow = withCaseStats({
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
        testCaseTotal: 0,
        testCasePass: 0,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: null,
        solverNote: null,
        green: false,
    }, caseStats);
    row.green = isMatrixRowGreen(row);
    return row;
}

/** ??????`legion test` ?????manifest ?????? `run_nyar_solver` ??? `metadata.tests` ????? */
export function isValkyrieNyarGreen(row: ValkyrieNyarMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
