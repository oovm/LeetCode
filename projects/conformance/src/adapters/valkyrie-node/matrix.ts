import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { NODE_WASM_TARGET, isArtifactCacheFresh } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { readMatrixManifestAudit } from '../shared/matrix-manifest-audit.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import { emptySolverCaseStats, type SolverCaseStats } from '../shared/solver-case-stats.ts';
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
    testCaseTotal: number;
    testCasePass: number;
    testCaseFail: number;
    firstFailureIndex: number | null;
    firstFailure: string | null;
    solverNote: string | null;
    green: boolean;
};

function withCaseStats(row: ValkyrieMatrixRow, stats: SolverCaseStats): ValkyrieMatrixRow {
    row.testCaseTotal = stats.testCaseTotal;
    row.testCasePass = stats.testCasePass;
    row.testCaseFail = stats.testCaseFail;
    row.firstFailureIndex = stats.firstFailureIndex;
    row.firstFailure = stats.firstFailure;
    return row;
}

function blockedWasmRow(problem: ProblemDefinition, solverNote: string): ValkyrieMatrixRow {
    return withCaseStats({
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
        testCaseTotal: 0,
        testCasePass: 0,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: solverNote,
        solverNote,
        green: false,
    }, emptySolverCaseStats(solverNote));
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
    let caseStats = emptySolverCaseStats();
    if (build.status === 0) {
        if (!freshness.fresh) {
            runtimeOk = false;
            runtimeError = freshness.reason ?? 'build ?????????? execution manifest';
            caseStats = emptySolverCaseStats(runtimeError);
        } else {
            const artifacts = resolveVBuildArtifacts(problem);
            if (!artifacts) {
                runtimeOk = false;
                runtimeError = 'build ?????¦Ä?????? wasm/js ????';
                caseStats = emptySolverCaseStats(runtimeError);
            } else {
                const ref = await runVReference(problem, { artifacts, buildRoute: build.route });
                runtimeOk = ref.ok;
                runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests ¦Ä???';
                caseStats = ref.caseStats;
            }
        }
    }

    const manifestAudit = readMatrixManifestAudit(artifactDir);
    const row: ValkyrieMatrixRow = withCaseStats({
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

/** ??????`legion test` ?????manifest ?????? `run_v_solver` ??? `metadata.tests` ????? */
export function isValkyrieGreen(row: ValkyrieMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
