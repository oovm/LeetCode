import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { resolveArtifactDir } from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { readArtifactEvidence } from '../shared/artifact-evidence.ts';
import { deriveArtifactRuntimeStatus, type ArtifactRuntimeStatus } from '../shared/artifact-runtime-status.ts';
import {
    CompileTargetPlanError,
    resolveLaneTargetPlan,
    type CompileTargetPlan,
    type CompileTargetPlanSource,
} from '../shared/compile-target-plan.ts';
import { readMatrixManifestAudit } from '../shared/matrix-manifest-audit.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import { emptySolverCaseStats, type SolverCaseStats } from '../shared/solver-case-stats.ts';
import { valkyrieSolverBlockedReason } from '../valkyrie-node/valkyrie.ts';
import { formatLegionError, legionBuildNyar, legionTestNyar, NYAR_BUILD_TARGET, nyarBuildDir } from './valkyrie.ts';
import { resolveNyarBuildArtifacts, resolveNyarInvokeBlocker, runNyarReference } from './ref.ts';

/**
 * 旧 nyar lane 的行。
 *
 * 该 lane 的 target 是 lane 自身显式指定的 `ovm`（`targetSource: 'lane-explicit'`），
 * 不是 manifest 声明的 `wasm`；它不参与交付完成度统计（见矩阵报告的 lane 描述）。
 */
export type ValkyrieNyarMatrixRow = {
    id: string;
    /** 计划 canonical triple：本行 build / test / freshness 判定的唯一执行身份。 */
    target: string;
    /** lane 声明的 target 原文（lane-explicit 来源时即 lane 显式值）。 */
    declaredTarget: string | null;
    /** target 声明来源；计划解析失败时为 null。 */
    targetSource: CompileTargetPlanSource | null;
    /** target 计划解析的结构化失败原因；成功时为 null。 */
    targetError: string | null;
    /** execution manifest 实际记录的 target：只是证据，不是期望值。 */
    manifestTarget: string | null;
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
    /** 由实际 artifact 推导的 runtime 三态。 */
    runtimeStatus: ArtifactRuntimeStatus;
    /** runtime 状态的可诊断原因。 */
    runtimeReason: string | null;
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

type ValkyrieNyarMatrixRowNoGreen = Omit<ValkyrieNyarMatrixRow, 'green'>;

function withCaseStats(row: ValkyrieNyarMatrixRowNoGreen, stats: SolverCaseStats): ValkyrieNyarMatrixRow {
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

function baseRow(problem: ProblemDefinition): ValkyrieNyarMatrixRowNoGreen {
    return {
        id: problem.id,
        target: '',
        declaredTarget: null,
        targetSource: null,
        targetError: null,
        manifestTarget: null,
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
        runtimeStatus: 'pending',
        runtimeReason: null,
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

/** 无法进入 build 的行（题解缺失 / lane 计划失败）：所有证据如实留空并带原因。 */
function blockedNyarRow(problem: ProblemDefinition, solverNote: string, targetError: string | null = null): ValkyrieNyarMatrixRow {
    return withCaseStats(
        {
            ...baseRow(problem),
            targetError,
            buildError: targetError ?? solverNote,
            testError: targetError ?? solverNote,
            manifestError: targetError ?? solverNote,
            runtimeReason: targetError ?? solverNote,
            runtimeError: targetError ?? solverNote,
            solverNote,
            firstFailure: targetError ?? solverNote,
        },
        emptySolverCaseStats(targetError ?? solverNote),
    );
}

export async function probeValkyrieNyarProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieNyarMatrixRow> {
    const problemRoot = join(projectPath, '..', '..');
    const solverNote = valkyrieSolverBlockedReason(problemRoot);
    if (solverNote) {
        return blockedNyarRow(problem, solverNote);
    }

    // 单一事实来源：lane 计划只解析一次，build / test / freshness 全部复用
    let plan: CompileTargetPlan;
    try {
        plan = resolveLaneTargetPlan(projectPath, NYAR_BUILD_TARGET);
    } catch (error) {
        const detail = error instanceof CompileTargetPlanError ? `${error.code}: ${error.message}` : String(error);
        return blockedNyarRow(problem, detail, detail);
    }

    const outDir = nyarBuildDir(problem);
    mkdirSync(outDir, { recursive: true });
    const build = legionBuildNyar(plan, outDir);
    const test = legionTestNyar(plan);

    const artifactDir = resolveArtifactDir(outDir, plan.canonicalTarget);
    const evidence = readArtifactEvidence(artifactDir, plan);
    const artifacts = resolveNyarBuildArtifacts(problem);
    const invokeBlocker = artifacts
        ? resolveNyarInvokeBlocker(problemRoot, artifacts.nyarPath)
        : null;

    const verdict = deriveArtifactRuntimeStatus({
        buildOk: build.status === 0,
        artifactsPresent: artifacts !== null,
        evidence,
        invokeBlocker,
    });

    let runtimeOk = false;
    let runtimeError: string | null = null;
    let caseStats = emptySolverCaseStats(verdict.reason);
    if (verdict.status === 'ready' && artifacts) {
        const ref = await runNyarReference(problem, {
            artifacts,
            buildRoute: build.route,
            compileTarget: plan.canonicalTarget,
        });
        runtimeOk = ref.ok;
        runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests 未执行';
        caseStats = ref.caseStats;
    }

    const manifestAudit = readMatrixManifestAudit(evidence.manifest);
    const row: ValkyrieNyarMatrixRow = withCaseStats(
        {
            ...baseRow(problem),
            target: plan.canonicalTarget,
            declaredTarget: plan.declaredTarget,
            targetSource: plan.source,
            manifestTarget: evidence.manifestTarget,
            buildStatus: build.status,
            testStatus: test.status,
            buildRoute: build.route,
            testRoute: test.route,
            buildError: build.status === 0 ? null : formatLegionError(`legion build --target ${plan.canonicalTarget}`, build),
            testError: test.status === 0 ? null : formatLegionError(`legion test --target ${plan.canonicalTarget}`, test),
            manifestFresh: evidence.fresh,
            manifestError: evidence.reason,
            manifestSchemaVersion: manifestAudit.manifestSchemaVersion,
            semanticClosureHash: manifestAudit.semanticClosureHash,
            canonicalSurfaceHash: manifestAudit.canonicalSurfaceHash,
            hostProviderBindingHash: manifestAudit.hostProviderBindingHash,
            runtimeStatus: verdict.status,
            runtimeReason: verdict.reason,
            runtimeOk,
            runtimeError,
        },
        caseStats,
    );
    row.green = isMatrixRowGreen(row);
    return row;
}

/** 判断 `legion test` 是否通过 + manifest 一致 + `run_nyar_solver` metadata.tests 跑通。 */
export function isValkyrieNyarGreen(row: ValkyrieNyarMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
