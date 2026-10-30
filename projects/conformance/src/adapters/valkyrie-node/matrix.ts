import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { readArtifactEvidence } from '../shared/artifact-evidence.ts';
import {
    type ArtifactRuntimeStatus,
    deriveArtifactRuntimeStatus,
} from '../shared/artifact-runtime-status.ts';
import {
    CompileTargetPlanError,
    resolveCompileTargetPlan,
    type CompileTargetPlan,
    type CompileTargetPlanSource,
} from '../shared/compile-target-plan.ts';
import { readMatrixManifestAudit } from '../shared/matrix-manifest-audit.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import { emptySolverCaseStats, type SolverCaseStats } from '../shared/solver-case-stats.ts';
import { VALKYRIE_NODE } from './config.ts';
import { formatLegionError, legionBuildNative, legionTest, valkyrieSolverBlockedReason } from './valkyrie.ts';
import {
    resolveVBuildArtifacts,
    resolveWasmInvokeBlocker,
    runVReference,
    vBuildDir,
    type VBuildArtifacts,
} from './ref.ts';

export type ValkyrieMatrixRow = {
    id: string;
    /** 计划 canonical triple：本行 build / test / freshness 判定的唯一执行身份。 */
    target: string;
    /** manifest 声明的 target 原文（来源为 `lane-explicit` 时为 null）。 */
    declaredTarget: string | null;
    /** target 声明来源；计划解析失败时为 null。 */
    targetSource: CompileTargetPlanSource | null;
    /** target 计划解析的结构化失败原因；成功时为 null。 */
    targetError: string | null;
    /** execution manifest 实际记录的 target：只是证据，不是期望值。 */
    manifestTarget: string | null;
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

function baseRow(problem: ProblemDefinition): ValkyrieMatrixRowNoGreen {
    return {
        id: problem.id,
        target: '',
        declaredTarget: null,
        targetSource: null,
        targetError: null,
        manifestTarget: null,
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

/** 无法进入 build 的行（题解缺失 / target 计划失败）：所有证据如实留空并带原因。 */
function blockedWasmRow(problem: ProblemDefinition, solverNote: string, targetError: string | null = null): ValkyrieMatrixRow {
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

/** 计划解析失败时绝不猜测 target：结构化记录错误并以 pending 收尾。 */
function planErrorRow(problem: ProblemDefinition, error: unknown): ValkyrieMatrixRow {
    const detail = error instanceof CompileTargetPlanError
        ? `${error.code}: ${error.message}`
        : String(error);
    return blockedWasmRow(problem, detail, detail);
}

export async function probeValkyrieProblem(problem: ProblemDefinition, projectPath: string): Promise<ValkyrieMatrixRow> {
    const problemRoot = join(projectPath, '..', '..');
    const solverNote = valkyrieSolverBlockedReason(problemRoot);
    if (solverNote) {
        return blockedWasmRow(problem, solverNote);
    }

    // 单一事实来源：target 只在这里解析一次，build / test / freshness 全部复用同一计划对象
    let plan: CompileTargetPlan;
    try {
        plan = resolveCompileTargetPlan(projectPath);
    } catch (error) {
        return planErrorRow(problem, error);
    }

    const outDir = vBuildDir(problem);
    mkdirSync(outDir, { recursive: true });

    const build = legionBuildNative(plan, outDir);
    const test = legionTest(plan);

    const evidence = readArtifactEvidence(outDir, plan);
    const artifacts = resolveVBuildArtifacts(problem);
    const invokeBlocker = artifacts
        ? resolveWasmInvokeBlocker(problemRoot, artifacts.entry.legionWasm)
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
        const ref = await runVReference(problem, {
            artifacts: artifacts as VBuildArtifacts,
            buildRoute: build.route,
            compileTarget: plan.canonicalTarget,
        });
        runtimeOk = ref.ok;
        runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests 未执行';
        caseStats = ref.caseStats;
    }

    const manifestAudit = readMatrixManifestAudit(evidence.manifest);
    const row: ValkyrieMatrixRow = withCaseStats(
        {
            ...baseRow(problem),
            target: plan.canonicalTarget,
            declaredTarget: plan.source === 'manifest' ? plan.declaredTarget : null,
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

/** 判断 `legion test` 是否通过 + manifest 一致 + `run_v_solver` metadata.tests 跑通。 */
export function isValkyrieGreen(row: ValkyrieMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
