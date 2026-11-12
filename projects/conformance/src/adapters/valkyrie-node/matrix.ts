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
import {
    classifyMatrixOutcome,
    collectUnverifiedReasons,
    emptySolverCaseStats,
    type CaseRecord,
    type MatrixRowOutcome,
    type MatrixUnverifiedReason,
    type SolverCaseStats,
} from '../shared/solver-case-stats.ts';
import { VALKYRIE_NODE } from './config.ts';
import type { QuarantineRemoval } from '../../reporting/corpus-quarantine.ts';
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
    executed_pass: number;
    executed_fail: number;
    blocked: number;
    not_run: number;
    /** 没有可执行期望、已从 pass/fail 分母排除的用例数。 */
    skipped?: number;
    /** `skipped` 中因 `Execution timed out` 哨兵的条数。 */
    skipped_timeout?: number;
    /** `skipped` 中因整数 ABI 送不进非整数实参的条数。 */
    skipped_integer_argument?: number;
    firstFailureIndex: number | null;
    firstFailure: string | null;
    solverNote: string | null;
    /** 逐例真实观测记录（旧格式行可为空）；隔离统计只消费记录，不倒推。 */
    cases?: CaseRecord[];
    /** 侧车隔离的逐例绑定证据与无法扣减坐标数；未施加隔离时缺省。 */
    quarantine?: { removed: QuarantineRemoval[]; unbound: number };
    green: boolean;
    /** 行级三态：绿 / 红 / 未验证。未验证不是失败。 */
    outcome: MatrixRowOutcome;
    /** 未验证原因清单；非未验证时为空。 */
    unverifiedReasons: MatrixUnverifiedReason[];
};

type ValkyrieMatrixRowNoGreen = Omit<ValkyrieMatrixRow, 'green' | 'outcome' | 'unverifiedReasons'>;

function withCaseStats(row: ValkyrieMatrixRowNoGreen, stats: SolverCaseStats): ValkyrieMatrixRow {
    return {
        ...row,
        testCaseTotal: stats.testCaseTotal,
        executed_pass: stats.executed_pass,
        executed_fail: stats.executed_fail,
        blocked: stats.blocked,
        not_run: stats.not_run,
        skipped: stats.skipped ?? 0,
        skipped_timeout: stats.skipped_timeout ?? 0,
        skipped_integer_argument: stats.skipped_integer_argument ?? 0,
        firstFailureIndex: stats.firstFailureIndex,
        firstFailure: stats.firstFailure,
        ...(stats.cases === undefined ? {} : { cases: stats.cases }),
        green: false,
        // 三态在 probe 末尾按完整行证据重算；这里先给安全的红色占位。
        outcome: 'red',
        unverifiedReasons: [],
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
        executed_pass: 0,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
        skipped: 0,
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
        runtimeError = ref.ok ? null : ref.stderr || 'cases 用例未执行';
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
    row.outcome = classifyMatrixOutcome(row);
    row.unverifiedReasons = collectUnverifiedReasons(row);
    return row;
}

/** 判断 `legion test` 是否通过 + manifest 一致 + `run_v_solver` cases 用例跑通。 */
export function isValkyrieGreen(row: ValkyrieMatrixRow): boolean {
    return isMatrixRowGreen(row);
}
