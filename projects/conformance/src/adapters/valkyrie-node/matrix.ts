import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { isArtifactCacheFreshForBuild, readExecutionManifest } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { readMatrixManifestAudit } from '../shared/matrix-manifest-audit.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import { emptySolverCaseStats, type SolverCaseStats } from '../shared/solver-case-stats.ts';
import { VALKYRIE_NODE } from './config.ts';
import { resolveCompileTargetFromManifest } from './manifest.ts';
import { formatLegionError, legionBuildNative, legionTest, valkyrieSolverBlockedReason } from './valkyrie.ts';
import { runVReference, resolveVBuildArtifacts, vArtifactDir, vBuildDir } from './ref.ts';

export type ValkyrieMatrixRow = {
    id: string;
    /** canonical triple（来自 execution manifest）。 */
    target: string;
    /** runner host（当前固定为 node，将来可切 d8 / wasmtime）。 */
    runnerHost: typeof VALKYRIE_NODE.runnerHost;
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

type ValkyrieMatrixRowNoGreen = Omit<ValkyrieMatrixRow, 'green'>;

function withCaseStats(row: ValkyrieMatrixRowNoGreen, stats: SolverCaseStats): ValkyrieMatrixRow {
    return {
        ...row,
        testCaseTotal: stats.testCaseTotal,
        testCasePass: stats.testCasePass,
        testCaseFail: stats.testCaseFail,
        firstFailureIndex: stats.firstFailureIndex,
        firstFailure: stats.firstFailure,
        green: false,
    };
}

function baseRow(problem: ProblemDefinition): Omit<ValkyrieMatrixRow, 'green'> {
    return {
        id: problem.id,
        // target 在 probeValkyrieProblem 里由 execution manifest 回填 —— 这里只给占位
        // 真正的 canonical triple 来自 legion build 后落盘的 execution manifest
        target: '',
        runnerHost: VALKYRIE_NODE.runnerHost,
        buildStatus: 1,
        testStatus: 1,
        buildRoute: null,
        testRoute: null,
        buildError: null,
        testError: null,
        manifestFresh: false,
        manifestError: null,
        manifestSchemaVersion: null,
        semanticClosureHash: null,
        canonicalSurfaceHash: null,
        hostProviderBindingHash: null,
        runtimeOk: false,
        runtimeError: null,
        testCaseTotal: 0,
        testCasePass: 0,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: null,
        solverNote: null,
    };
}

function blockedWasmRow(problem: ProblemDefinition, solverNote: string): ValkyrieMatrixRow {
    return withCaseStats(
        {
            ...baseRow(problem),
            buildError: solverNote,
            testError: solverNote,
            manifestError: solverNote,
            runtimeError: solverNote,
            solverNote,
            firstFailure: solverNote,
        },
        emptySolverCaseStats(solverNote),
    );
}

export async function probeValkyrieProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieMatrixRow> {
    const problemRoot = join(projectPath, '..', '..');
    const solverNote = valkyrieSolverBlockedReason(problemRoot);
    if (solverNote) {
        return blockedWasmRow(problem, solverNote);
    }

    const outDir = vBuildDir(problem);
    mkdirSync(outDir, { recursive: true });

    // 先解析 manifest 里的 compile target —— 错误信息里用它，让日志真实
    let compileTarget: string | null = null;
    try {
        compileTarget = resolveCompileTargetFromManifest(projectPath);
    } catch (err) {
        return blockedWasmRow(problem, String(err));
    }

    const build = legionBuildNative(projectPath, outDir);
    const test = legionTest(projectPath);

    const artifactDir = vArtifactDir(problem);
    const freshness = isArtifactCacheFreshForBuild(artifactDir);

    // 从 execution manifest 读取 canonical triple —— 不再硬编码 adapter 默认值
    const executionManifest = readExecutionManifest(artifactDir);
    const manifestTarget = executionManifest?.target ?? '';

    let runtimeOk = false;
    let runtimeError: string | null = null;
    let caseStats = emptySolverCaseStats();
    if (build.status === 0) {
        if (!freshness.fresh) {
            runtimeOk = false;
            runtimeError = freshness.reason ?? 'build 产物与 execution manifest 不匹配';
            caseStats = emptySolverCaseStats(runtimeError);
        } else {
            const artifacts = resolveVBuildArtifacts(problem);
            if (!artifacts) {
                runtimeOk = false;
                runtimeError = 'build 成功但找不到 wasm/js 入口';
                caseStats = emptySolverCaseStats(runtimeError);
            } else {
                const ref = await runVReference(problem, { artifacts, buildRoute: build.route });
                runtimeOk = ref.ok;
                runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests 未执行';
                caseStats = ref.caseStats;
            }
        }
    }

    const manifestAudit = readMatrixManifestAudit(artifactDir);
    const row: ValkyrieMatrixRow = withCaseStats(
        {
            ...baseRow(problem),
            target: manifestTarget,
            buildStatus: build.status,
            testStatus: test.status,
            buildRoute: build.route,
            testRoute: test.route,
            buildError: build.status === 0 ? null : formatLegionError(`legion build --target ${compileTarget}`, build),
            testError: test.status === 0 ? null : formatLegionError(`legion test --target ${compileTarget}`, test),
            manifestFresh: freshness.fresh,
            manifestError: freshness.fresh ? null : freshness.reason,
            manifestSchemaVersion: manifestAudit.manifestSchemaVersion,
            semanticClosureHash: manifestAudit.semanticClosureHash,
            canonicalSurfaceHash: manifestAudit.canonicalSurfaceHash,
            hostProviderBindingHash: manifestAudit.hostProviderBindingHash,
            runtimeOk,
            runtimeError,
        },
        caseStats,
    );
    row.green = isMatrixRowGreen(row);
    return row;
}

/** 判断 `legion test` 是否通过 + manifest 一致 + `run_v_solver` metadata.tests 跑通。 */
export function isValkyrieGreen(row: ValkyrieMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
