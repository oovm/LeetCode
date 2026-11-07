import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import {
    formatLegionCliError,
    legionBuildProject,
    legionTestProject,
    resolveArtifactDir,
} from '@nyar/valkyrie';

import type { ProblemDefinition } from '../../catalog/index.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../../domain/paths.ts';
import { readArtifactEvidence } from '../shared/artifact-evidence.ts';
import { deriveArtifactRuntimeStatus, type ArtifactRuntimeStatus } from '../shared/artifact-runtime-status.ts';
import {
    CompileTargetPlanError,
    resolveLaneTargetPlan,
    type CompileTargetPlan,
    type CompileTargetPlanSource,
} from '../shared/compile-target-plan.ts';
import {
    ManagedAbiError,
    managedArtifactFileName,
    readManagedAbiContract,
    type ManagedAbiContract,
} from './managed-abi.ts';
import { readManagedCompileEvidence, resolveManagedArtifact } from './managed-evidence.ts';
import { runManagedReference } from './managed-runner.ts';
import { readMatrixManifestAudit } from '../shared/matrix-manifest-audit.ts';
import { isMatrixRowGreen } from '../shared/matrix-green.ts';
import {
    classifyMatrixOutcome,
    collectUnverifiedReasons,
    emptySolverCaseStats,
    type MatrixRowOutcome,
    type MatrixUnverifiedReason,
    type SolverCaseStats,
} from '../shared/solver-case-stats.ts';
import { valkyrieSolverBlockedReason } from '../valkyrie-node/valkyrie.ts';
import { nyarBuildDir } from '../valkyrie-nyar/valkyrie.ts';
import { resolveNyarBuildArtifacts, resolveNyarInvokeBlocker, runNyarReference } from '../valkyrie-nyar/ref.ts';

/**
 * Legion 后端 lane 的编译目标：一律 lane 显式指定（`targetSource: 'lane-explicit'`），
 * canonical triple 由 `legionPlan` 结构化推导，禁止按标签字符串硬编码。
 */
export type ValkyrieBackendLaneTarget = 'ovm' | 'jvm' | 'clr';

/**
 * 后端 lane 的行（ovm 执行 lane / jvm、clr 对照 lane 共用同一结构）。
 *
 * 每个 lane 独立探测、独立记录证据；任何 lane 的结果绝不复制自其他 lane。
 */
export type ValkyrieBackendMatrixRow = {
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
    /** managed 合同 digest（只来自 `managed-abi.json`，`ovm`/`wasm` 为 null）。 */
    managedContractDigest: string | null;
    /** managed 首个用例的真实启动命令；未执行时为 null。 */
    managedInvokeCommand: string | null;
    /** managed 全量用例统一为 0 时记 0；未执行时为 null。 */
    managedInvokeExitStatus: number | null;
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
    green: boolean;
    /** 行级三态：绿 / 红 / 未验证。未验证不是失败。 */
    outcome: MatrixRowOutcome;
    /** 未验证原因清单；非未验证时为空。 */
    unverifiedReasons: MatrixUnverifiedReason[];
};

type ValkyrieBackendMatrixRowNoGreen = Omit<ValkyrieBackendMatrixRow, 'green' | 'outcome' | 'unverifiedReasons'>;

function withCaseStats(row: ValkyrieBackendMatrixRowNoGreen, stats: SolverCaseStats): ValkyrieBackendMatrixRow {
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
        green: false,
        // 三态在 probe 末尾按完整行证据重算；这里先给安全的红色占位。
        outcome: 'red',
        unverifiedReasons: [],
    };
}

function baseRow(problem: ProblemDefinition): ValkyrieBackendMatrixRowNoGreen {
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
        managedContractDigest: null,
        managedInvokeCommand: null,
        managedInvokeExitStatus: null,
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

/** 无法进入 build 的行（题解缺失 / lane 计划失败）：所有证据如实留空并带原因。 */
function blockedBackendRow(problem: ProblemDefinition, solverNote: string, targetError: string | null = null): ValkyrieBackendMatrixRow {
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

/** 每 lane 独立输出目录；ovm 沿用历史 `bench-nyar` 目录以保持既有证据连续。 */
export function backendBuildDir(problem: ProblemDefinition, lane: ValkyrieBackendLaneTarget): string {
    if (lane === 'ovm') {
        return nyarBuildDir(problem);
    }
    return join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-${lane}`);
}

/**
 * 按 lane 显式 target 探测单个题目的后端 lane。
 *
 * 流程：lane 计划解析 → `legion build` → `legion test` → 产物证据 → runtime 三态推导。
 * build 失败（如 jvm/clr 生产 lowering 未启用时 emitter 的结构化拒绝）即如实记录
 * pending/blocked 与原始诊断文本；绝不执行参考、绝不复制其他 lane 的结果。
 * 参考执行（`run_nyar_solver`）只存在于 ovm 执行 lane。
 */
export async function probeValkyrieBackendProblem(
    problem: ProblemDefinition,
    projectPath: string,
    lane: ValkyrieBackendLaneTarget,
): Promise<ValkyrieBackendMatrixRow> {
    const problemRoot = join(projectPath, '..', '..');
    const solverNote = valkyrieSolverBlockedReason(problemRoot);
    if (solverNote) {
        return blockedBackendRow(problem, solverNote);
    }

    // 单一事实来源：lane 计划只解析一次，build / test / freshness 全部复用
    let plan: CompileTargetPlan;
    try {
        plan = resolveLaneTargetPlan(projectPath, lane);
    } catch (error) {
        const detail = error instanceof CompileTargetPlanError ? `${error.code}: ${error.message}` : String(error);
        return blockedBackendRow(problem, detail, detail);
    }

    const outDir = backendBuildDir(problem, lane);
    mkdirSync(outDir, { recursive: true });
    const build = legionBuildProject(plan.solverDir, plan.canonicalTarget, outDir);
    const test = legionTestProject(plan.solverDir, plan.canonicalTarget);

    const artifactDir = resolveArtifactDir(outDir, plan.canonicalTarget);
    const evidence = readArtifactEvidence(artifactDir, plan);
    // 执行 lane（ovm）用 `.nyar` 入口；对照 lane（jvm/clr）用 managed 产物（`jar` / `dll`）
    // 与 `managed-abi.json` 合同。缺合同、artifact/lane 不符或 digest 不能复算时结构化 blocked。
    const artifacts = lane === 'ovm' ? resolveNyarBuildArtifacts(problem) : null;
    const managedArtifact = lane === 'ovm' ? null : resolveManagedArtifact(outDir, lane);
    let managedContract: ManagedAbiContract | null = null;
    let managedBlocker: string | null = null;
    if (lane !== 'ovm') {
        if (managedArtifact === null) {
            managedBlocker = 'managed 产物（`jar`/`dll`）缺失或目录内存在多个候选';
        } else {
            try {
                managedContract = readManagedAbiContract(outDir, lane, managedArtifactFileName(managedArtifact));
            } catch (error) {
                managedBlocker = error instanceof ManagedAbiError ? error.reason : String(error);
            }
        }
    }
    const invokeBlocker = artifacts
        ? resolveNyarInvokeBlocker(problemRoot, artifacts.nyarPath)
        : managedBlocker;

    const verdict = deriveArtifactRuntimeStatus({
        buildOk: build.status === 0,
        artifactsPresent: lane === 'ovm' ? artifacts !== null : managedArtifact !== null,
        evidence,
        invokeBlocker,
    });

    let runtimeOk = false;
    let runtimeError: string | null = null;
    let managedContractDigest: string | null = null;
    let managedInvokeCommand: string | null = null;
    let managedInvokeExitStatus: number | null = null;
    let caseStats = emptySolverCaseStats(verdict.reason);
    if (lane === 'ovm' && verdict.status === 'ready' && artifacts) {
        const ref = await runNyarReference(problem, {
            artifacts,
            buildRoute: build.route,
            compileTarget: plan.canonicalTarget,
        });
        runtimeOk = ref.ok;
        runtimeError = ref.ok ? null : ref.stderr || 'metadata.tests 未执行';
        caseStats = ref.caseStats;
    }
    if (lane !== 'ovm' && verdict.status === 'ready' && managedArtifact !== null && managedContract !== null) {
        const managed = runManagedReference(problemRoot, lane, managedArtifact, managedContract);
        runtimeOk = managed.ok;
        runtimeError = managed.error;
        caseStats = managed.caseStats;
        managedContractDigest = managedContract.contract_digest;
        managedInvokeCommand = managed.command;
        managedInvokeExitStatus = managed.exitStatus;
    }

    const manifestAudit = readMatrixManifestAudit(evidence.manifest);
    // 对照 lane 的 compile-evidence digest 只作补充身份；execution manifest 才是 freshness 依据。
    const managedEvidence = lane === 'ovm' ? null : readManagedCompileEvidence(outDir);
    const row: ValkyrieBackendMatrixRow = withCaseStats(
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
            buildError: build.status === 0 ? null : formatLegionCliError(`legion build --target ${plan.canonicalTarget}`, build),
            testError: test.status === 0 ? null : formatLegionCliError(`legion test --target ${plan.canonicalTarget}`, test),
            manifestFresh: evidence.fresh,
            manifestError: lane !== 'ovm' && managedArtifact !== null && evidence.manifest === null
                ? 'managed 产物缺少 `run-contracts.txt`（execution manifest），且无 managed ABI invoke 合同'
                : evidence.reason,
            manifestSchemaVersion: manifestAudit.manifestSchemaVersion,
            semanticClosureHash: manifestAudit.semanticClosureHash ?? managedEvidence?.semanticClosureHash ?? null,
            canonicalSurfaceHash: manifestAudit.canonicalSurfaceHash ?? managedEvidence?.canonicalSurfaceHash ?? null,
            hostProviderBindingHash: manifestAudit.hostProviderBindingHash ?? managedEvidence?.hostProviderBindingHash ?? null,
            runtimeStatus: verdict.status,
            runtimeReason: verdict.reason,
            runtimeOk,
            runtimeError,
            managedContractDigest,
            managedInvokeCommand,
            managedInvokeExitStatus,
        },
        caseStats,
    );
    row.green = isMatrixRowGreen(row);
    row.outcome = classifyMatrixOutcome(row);
    row.unverifiedReasons = collectUnverifiedReasons(row);
    return row;
}
