#!/usr/bin/env node
/**
 * 生成 `native-dll` lane 矩阵报告：显式 `x86_64-pc-windows-msvc` 普通 C ABI 库。
 *
 * 与 `native` lane（`--target node` 的 Node-API addon）共用同一题目主序与同一份
 * 源码，但独立构建目录、独立产物身份、独立验收。四段证据逐题保留：
 * **build → load → execute → strict**，并记录每道题的首个失败阶段。
 *
 * 默认跑固定代表题集（两边都能表达的纯 `i64` 标量题，含一道内部用集合的题）；
 * `--all` / `--limit N` 切换到与 Node lane 相同的题目主序批量运行。
 */
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatLegionCliError, legionBuildProject, legionNativeReady, resolveArtifactDir } from '@nyar/valkyrie';

import { PROBLEMS, legionProjectDir, problemDir } from '../catalog/index.ts';
import { hasValkyrieSolver, valkyrieSolverBlockedReason } from '../adapters/valkyrie-node/valkyrie.ts';
import { readArtifactEvidence } from '../adapters/shared/artifact-evidence.ts';
import { resolveLaneTargetPlan } from '../adapters/shared/compile-target-plan.ts';
import { emptySolverCaseStats, type SolverCaseStats } from '../adapters/shared/solver-case-stats.ts';
import {
    DLL_LANE_TARGET,
    DLL_REPRESENTATIVE_IDS,
    resolveDllArtifact,
    resolveDllConsumerRuntime,
    runDllReference,
    type DllFailureStage,
} from '../adapters/valkyrie-backend/native-dll-runner.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../domain/paths.ts';
import { parseBatchLimit, problemsForBatch } from '../planning/batch-limit.ts';
import { resolveAddonIdentity, resolveCompilerBuildIdentity } from '../observation/toolchain-identity.ts';
import type { ProblemDefinition } from '../catalog/index.ts';

const CONFORMANCE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULT_REPORT_PATH = join(CONFORMANCE_ROOT, 'reports', 'matrix-native-dll-representative.json');

/** 本 lane 的独立产物目录，与 `node` lane 的证据互不覆盖。 */
export function dllBuildDir(problem: ProblemDefinition): string {
    return join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-native-dll`);
}

export type DllMatrixProblemRow = {
    id: string;
    /** 计划 canonical triple（本 lane 恒为显式 `x86_64-pc-windows-msvc`）。 */
    target: string;
    manifestTarget: string | null;
    manifestFresh: boolean;
    manifestError: string | null;
    buildStatus: number;
    buildError: string | null;
    /** 清单声明的单一 `.dll` 与 `c-abi` 导出面；不可用时为 null。 */
    artifact: { dll: string; exports: { sourceName: string; logicalName: string; abi: string }[] } | null;
    /** 产物解析（清单/身份/物理产物）阶段与原因。 */
    resolutionStage: 'load' | 'identity' | null;
    resolutionBlocker: string | null;
    /** 消费者确认装载成功（至少一条用例进入 dlopen 后的调用）。 */
    loadOk: boolean;
    /** 至少一条用例真实进入 C 调用。 */
    executeOk: boolean;
    /** 全部可执行用例执行且断言相符，无跳过、无阻塞。 */
    strictPass: boolean;
    firstFailureStage: DllFailureStage | null;
    error: string | null;
    command: string | null;
    exitStatus: number | null;
    caseStats: SolverCaseStats;
};

export type DllMatrixReport = {
    generatedAt: string;
    lane: 'native-dll';
    target: string;
    selection: { mode: 'representative' | 'corpus' | 'ids'; batchLimit: number | null; ids: string[] };
    identity: {
        addon: { state: 'resolved'; sha256: string } | { state: 'unresolved'; reason: string };
        compilerBuild: { state: 'resolved'; identity: string; fingerprint: string } | { state: 'unresolved'; reason: string };
        valkyrieV: { state: 'resolved'; rev: string } | { state: 'unresolved'; reason: string };
        dllConsumer: { state: 'resolved'; sha256: string } | { state: 'unresolved'; reason: string };
    };
    summary: {
        denominator: number;
        buildPass: number;
        loadPass: number;
        executePass: number;
        strictPass: number;
        testCaseTotal: number;
        executed_pass: number;
        executed_fail: number;
        blocked: number;
        not_run: number;
        skipped: number;
    };
    problems: DllMatrixProblemRow[];
};

function parseArgs(argv: string[]): { outPath: string; ids: Set<string> | null; mode: 'representative' | 'corpus'; limit: number | null } {
    let outPath = DEFAULT_REPORT_PATH;
    let ids: Set<string> | null = null;
    let mode: 'representative' | 'corpus' = 'representative';
    let limit: number | null = null;
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--out' && argv[index + 1]) {
            outPath = argv[index + 1]!;
            index += 1;
            continue;
        }
        if ((arg === '--id' || arg === '-i') && argv[index + 1]) {
            ids ??= new Set<string>();
            for (const value of argv[index + 1]!.split(',').map((part) => part.trim()).filter((part) => part.length > 0)) {
                ids.add(value);
            }
            index += 1;
            continue;
        }
        if (arg === '--all') {
            mode = 'corpus';
            continue;
        }
        if (arg === '--limit' && argv[index + 1]) {
            const parsed = Number(argv[index + 1]);
            if (!Number.isFinite(parsed) || parsed < 0) {
                throw new Error(`无效的 --limit ${argv[index + 1]}`);
            }
            mode = 'corpus';
            limit = parsed === 0 ? null : Math.floor(parsed);
            index += 1;
        }
    }
    return { outPath, ids, mode, limit };
}

function probeIdentity(): DllMatrixReport['identity'] {
    const addon = resolveAddonIdentity();
    const compilerBuild = resolveCompilerBuildIdentity();
    const valkyrieVRoot = process.env.VALKYRIE_V_ROOT?.trim() || join(LEETCODE_ROOT_FROM_PACKAGE, '..', 'valkyrie.v');
    let valkyrieV: DllMatrixReport['identity']['valkyrieV'];
    try {
        const probe = spawnSync('git', ['-C', valkyrieVRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
        const rev = probe.status === 0 ? probe.stdout.trim() : '';
        valkyrieV = rev.length > 0
            ? { state: 'resolved', rev }
            : { state: 'unresolved', reason: `git rev-parse HEAD 失败：${probe.stderr?.trim() || `status=${probe.status}`}` };
    }
    catch (error) {
        valkyrieV = { state: 'unresolved', reason: `valkyrie.v rev 读取失败：${String(error)}` };
    }
    const runtime = resolveDllConsumerRuntime();
    let dllConsumer: DllMatrixReport['identity']['dllConsumer'];
    if (runtime === null) {
        dllConsumer = { state: 'unresolved', reason: 'bun 可执行文件或 tools/dll-consumer.ts 缺失' };
    }
    else {
        try {
            dllConsumer = {
                state: 'resolved',
                sha256: createHash('sha256').update(readFileSync(runtime.consumerPath)).digest('hex'),
            };
        }
        catch (error) {
            dllConsumer = { state: 'unresolved', reason: `消费者摘要读取失败：${String(error)}` };
        }
    }
    return {
        addon: addon.state === 'resolved'
            ? { state: 'resolved', sha256: addon.sha256 }
            : { state: 'unresolved', reason: addon.reason },
        compilerBuild: compilerBuild.state === 'resolved'
            ? { state: 'resolved', identity: compilerBuild.identity, fingerprint: compilerBuild.fingerprint }
            : { state: 'unresolved', reason: compilerBuild.reason },
        valkyrieV,
        dllConsumer,
    };
}

function blockedRow(problem: ProblemDefinition, stage: DllFailureStage, reason: string): DllMatrixProblemRow {
    return {
        id: problem.id,
        target: DLL_LANE_TARGET,
        manifestTarget: null,
        manifestFresh: false,
        manifestError: reason,
        buildStatus: 1,
        buildError: stage === 'build' ? reason : null,
        artifact: null,
        resolutionStage: null,
        resolutionBlocker: null,
        loadOk: false,
        executeOk: false,
        strictPass: false,
        firstFailureStage: stage,
        error: reason,
        command: null,
        exitStatus: null,
        caseStats: emptySolverCaseStats(reason),
    };
}

async function probeProblem(problem: ProblemDefinition): Promise<DllMatrixProblemRow> {
    const problemRoot = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    const solverNote = valkyrieSolverBlockedReason(problemRoot);
    if (solverNote) {
        return blockedRow(problem, 'build', solverNote);
    }
    const projectPath = legionProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    let plan;
    try {
        plan = resolveLaneTargetPlan(projectPath, DLL_LANE_TARGET);
    }
    catch (error) {
        return blockedRow(problem, 'build', `目标计划解析失败：${String(error)}`);
    }

    const outDir = dllBuildDir(problem);
    mkdirSync(outDir, { recursive: true });
    const build = legionBuildProject(plan.solverDir, plan.canonicalTarget, outDir);
    const buildError = build.status === 0
        ? null
        : formatLegionCliError(`legion build --target ${plan.canonicalTarget}`, build);

    const artifactDir = resolveArtifactDir(outDir, plan.canonicalTarget);
    const evidence = readArtifactEvidence(artifactDir, plan);
    const resolution = resolveDllArtifact(artifactDir);
    const runtime = resolveDllConsumerRuntime();

    const row: DllMatrixProblemRow = {
        id: problem.id,
        target: plan.canonicalTarget,
        manifestTarget: evidence.manifestTarget,
        manifestFresh: evidence.fresh,
        manifestError: evidence.reason,
        buildStatus: build.status,
        buildError,
        artifact: resolution.artifact === null
            ? null
            : {
                dll: resolution.artifact.dllPath,
                exports: resolution.artifact.exports.map((entry) => ({
                    sourceName: entry.sourceName,
                    logicalName: entry.logicalName,
                    abi: entry.abi,
                })),
            },
        resolutionStage: resolution.stage,
        resolutionBlocker: resolution.blocker,
        loadOk: false,
        executeOk: false,
        strictPass: false,
        firstFailureStage: null,
        error: null,
        command: null,
        exitStatus: null,
        caseStats: emptySolverCaseStats(null),
    };
    // manifest 审计字段只作证据；本 lane 的严格门是真实装载与调用，不用 schema 顶替。
    if (build.status !== 0) {
        row.firstFailureStage = 'build';
        row.error = buildError;
        row.caseStats = emptySolverCaseStats(buildError);
        return row;
    }
    if (resolution.artifact === null || resolution.stage !== null) {
        row.firstFailureStage = resolution.stage ?? 'load';
        row.error = resolution.blocker;
        row.caseStats = emptySolverCaseStats(resolution.blocker);
        return row;
    }
    if (runtime === null) {
        row.firstFailureStage = 'execute';
        row.error = 'DLL 消费者运行环境缺失（bun 或 tools/dll-consumer.ts）';
        row.caseStats = emptySolverCaseStats(row.error);
        return row;
    }

    const outcome = runDllReference(problemRoot, resolution.artifact, runtime, plan.canonicalTarget);
    row.loadOk = outcome.loaded;
    row.executeOk = outcome.executed;
    row.strictPass = outcome.ok && outcome.executed;
    row.firstFailureStage = row.strictPass ? null : (outcome.firstFailureStage ?? 'execute');
    row.error = outcome.error;
    row.command = outcome.command;
    row.exitStatus = outcome.exitStatus;
    row.caseStats = outcome.caseStats;
    return row;
}

async function main(): Promise<number> {
    const { outPath, ids, mode, limit } = parseArgs(process.argv.slice(2));
    if (!legionNativeReady()) {
        console.error('Valkyrie N-API 未就绪：无法构建库产物（在 valkyrie.rs 执行 cargo build -p valkyrie-napi）');
        return 2;
    }
    const runtime = resolveDllConsumerRuntime();
    if (runtime === null) {
        console.error('DLL 消费者运行环境缺失：需要 bun 与 projects/conformance/tools/dll-consumer.ts');
        return 2;
    }

    const corpus = PROBLEMS.filter((problem) => hasValkyrieSolver(problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem)));
    let selected: ProblemDefinition[];
    let batchLimit: number | null = limit;
    if (ids !== null) {
        selected = corpus.filter((problem) => ids.has(problem.id));
    }
    else if (mode === 'representative') {
        const wanted = new Set(DLL_REPRESENTATIVE_IDS);
        selected = corpus.filter((problem) => wanted.has(problem.id));
    }
    else {
        selected = problemsForBatch(corpus, { fallbackKeys: ['LEETCODE_MATRIX_LIMIT', 'LEETCODE_BENCH_LIMIT'] });
        batchLimit = limit ?? parseBatchLimit({ defaultLimit: 100, fallbackKeys: ['LEETCODE_MATRIX_LIMIT', 'LEETCODE_BENCH_LIMIT'] });
        if (limit !== null) {
            selected = selected.slice(0, limit);
        }
    }
    if (selected.length === 0) {
        console.error('没有可运行的题目：检查 --id / 代表题集是否存在于题库');
        return 2;
    }

    const identity = probeIdentity();
    console.log(
        `identity addon=${identity.addon.state === 'resolved' ? identity.addon.sha256 : `UNRESOLVED(${identity.addon.reason})`} ` +
            `compiler-build=${identity.compilerBuild.state === 'resolved' ? identity.compilerBuild.identity : `UNRESOLVED(${identity.compilerBuild.reason})`} ` +
            `consumer=${identity.dllConsumer.state === 'resolved' ? identity.dllConsumer.sha256 : `UNRESOLVED(${identity.dllConsumer.reason})`} ` +
            `valkyrie.v=${identity.valkyrieV.state === 'resolved' ? identity.valkyrieV.rev : `UNRESOLVED(${identity.valkyrieV.reason})`}`,
    );

    const problems: DllMatrixProblemRow[] = [];
    for (const problem of selected) {
        process.stderr.write(`dll-matrix ${problem.id}…\n`);
        problems.push(await probeProblem(problem));
    }

    const report: DllMatrixReport = {
        generatedAt: new Date().toISOString(),
        lane: 'native-dll',
        target: DLL_LANE_TARGET,
        selection: { mode: ids === null ? mode : 'ids', batchLimit, ids: selected.map((problem) => problem.id) },
        identity,
        summary: {
            denominator: selected.length,
            buildPass: problems.filter((problem) => problem.buildStatus === 0).length,
            loadPass: problems.filter((problem) => problem.loadOk).length,
            executePass: problems.filter((problem) => problem.executeOk).length,
            strictPass: problems.filter((problem) => problem.strictPass).length,
            testCaseTotal: problems.reduce((sum, problem) => sum + problem.caseStats.testCaseTotal, 0),
            executed_pass: problems.reduce((sum, problem) => sum + problem.caseStats.executed_pass, 0),
            executed_fail: problems.reduce((sum, problem) => sum + problem.caseStats.executed_fail, 0),
            blocked: problems.reduce((sum, problem) => sum + problem.caseStats.blocked, 0),
            not_run: problems.reduce((sum, problem) => sum + problem.caseStats.not_run, 0),
            skipped: problems.reduce((sum, problem) => sum + (problem.caseStats.skipped ?? 0), 0),
        },
        problems,
    };
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

    const { summary } = report;
    console.log(
        `wrote ${outPath}\n` +
            `target=${DLL_LANE_TARGET} selection=${report.selection.mode} denominator=${summary.denominator}\n` +
            `build ${summary.buildPass}/${summary.denominator} load ${summary.loadPass}/${summary.denominator} ` +
            `execute ${summary.executePass}/${summary.denominator} strict ${summary.strictPass}/${summary.denominator}\n` +
            `cases pass ${summary.executed_pass}/${summary.testCaseTotal} fail ${summary.executed_fail} ` +
            `blocked ${summary.blocked} not_run ${summary.not_run} skipped ${summary.skipped}\n` +
            problems
                .filter((problem) => !problem.strictPass)
                .map((problem) => `stage ${problem.id}: ${problem.firstFailureStage ?? '?'} — ${problem.error ?? '(no error)'}`)
                .join('\n'),
    );
    return 0;
}

main().catch((error) => {
    console.error(String(error));
    process.exit(1);
});
