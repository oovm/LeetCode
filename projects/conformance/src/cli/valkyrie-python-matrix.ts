#!/usr/bin/env node
/**
 * 生成 `python` lane 矩阵报告：CPython 扩展模块（`legion build --target python`）。
 *
 * 与 `native` lane 共用题库主序与源码，但独立构建目录、独立模块名合同、独立验收。
 * 四段证据逐题保留：**build → load → execute → strict**，并记录首个失败阶段；
 * 数组入参/返回尚未进入 CPython 宿主边界，这类题在构建阶段即如实计为载体缺口。
 */
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatLegionCliError, legionBuildProject, legionNativeReady, resolveArtifactDir } from '@nyar/valkyrie';

import { PROBLEMS, legionProjectDir, problemDir, type ProblemDefinition } from '../catalog/index.ts';
import { hasValkyrieSolver, valkyrieSolverBlockedReason } from '../adapters/valkyrie-node/valkyrie.ts';
import { readArtifactEvidence } from '../adapters/shared/artifact-evidence.ts';
import { resolveLaneTargetPlan } from '../adapters/shared/compile-target-plan.ts';
import { emptySolverCaseStats, type SolverCaseStats } from '../adapters/shared/solver-case-stats.ts';
import {
    PYTHON_LANE_TARGET,
    pythonConsumerPath,
    resolvePythonArtifact,
    resolvePythonRuntime,
    runPythonReference,
    type PythonFailureStage,
} from '../adapters/valkyrie-python/runner.ts';
import { LEETCODE_ROOT_FROM_PACKAGE } from '../domain/paths.ts';
import { parseBatchLimit, problemsForBatch } from '../planning/batch-limit.ts';
import { resolveAddonIdentity, resolveCompilerBuildIdentity } from '../observation/toolchain-identity.ts';

const CONFORMANCE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DEFAULT_REPORT_PATH = join(CONFORMANCE_ROOT, 'reports', 'matrix-python-representative.json');

/** Python lane 的独立产物目录。 */
export function pythonBuildDir(problem: ProblemDefinition): string {
    return join(LEETCODE_ROOT_FROM_PACKAGE, '.cache', `${problem.id}-bench-python`);
}

export type PythonMatrixProblemRow = {
    id: string;
    target: string;
    manifestTarget: string | null;
    manifestFresh: boolean;
    manifestError: string | null;
    buildStatus: number;
    buildError: string | null;
    /** 清单冻结的模块名与扩展文件；不可用时为 null。 */
    artifact: { extension: string; sha256: string; moduleName: string; exports: { sourceName: string; logicalName: string; abi: string; returns: string }[] } | null;
    resolutionStage: 'load' | 'identity' | 'carrier' | null;
    resolutionBlocker: string | null;
    loadOk: boolean;
    executeOk: boolean;
    strictPass: boolean;
    firstFailureStage: PythonFailureStage | null;
    error: string | null;
    command: string | null;
    exitStatus: number | null;
    caseStats: SolverCaseStats;
};

export type PythonMatrixReport = {
    generatedAt: string;
    lane: 'python';
    target: string;
    selection: { mode: 'representative' | 'corpus' | 'ids'; batchLimit: number | null; ids: string[] };
    identity: {
        addon: { state: 'resolved'; sha256: string } | { state: 'unresolved'; reason: string };
        compilerBuild: { state: 'resolved'; identity: string; fingerprint: string } | { state: 'unresolved'; reason: string };
        leetcodeV: { state: 'resolved'; rev: string } | { state: 'unresolved'; reason: string };
        boost: { state: 'resolved'; rev: string } | { state: 'unresolved'; reason: string };
        valkyrieV: { state: 'resolved'; rev: string } | { state: 'unresolved'; reason: string };
        pythonConsumer: { state: 'resolved'; sha256: string; runtime: string } | { state: 'unresolved'; reason: string };
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
    problems: PythonMatrixProblemRow[];
};

/** 默认可执行的 CPython 代表题（纯标量 / 文本，数组题留给载体缺口计数）。 */
const PYTHON_REPRESENTATIVE_IDS = ['multiply-strings', 'add-two-integers', 'reverse-integer'];

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

function gitRevision(root: string): { state: 'resolved'; rev: string } | { state: 'unresolved'; reason: string } {
    try {
        const probe = spawnSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
        const rev = probe.status === 0 ? probe.stdout.trim() : '';
        return rev.length > 0
            ? { state: 'resolved', rev }
            : { state: 'unresolved', reason: `git rev-parse HEAD 失败：${probe.stderr?.trim() || `status=${probe.status}`}` };
    }
    catch (error) {
        return { state: 'unresolved', reason: `git rev 读取失败：${String(error)}` };
    }
}

function fileSha256(path: string): string {
    return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function pythonRuntimeText(): string | null {
    const python = resolvePythonRuntime();
    if (python === null) {
        return null;
    }
    const probe = spawnSync(python, ['-c', 'import sys; print(sys.version.split()[0])'], { encoding: 'utf8', timeout: 15_000 });
    return probe.status === 0 ? `${python} ${probe.stdout.trim()}` : python;
}

function probeIdentity(): PythonMatrixReport['identity'] {
    const addon = resolveAddonIdentity();
    const compilerBuild = resolveCompilerBuildIdentity();
    const valkyrieVRoot = process.env.VALKYRIE_V_ROOT?.trim() || join(LEETCODE_ROOT_FROM_PACKAGE, '..', 'valkyrie.v');
    const boostRoot = process.env.BOOST_RS_ROOT?.trim();
    const valkyrieV = gitRevision(valkyrieVRoot);
    const leetcodeV = gitRevision(LEETCODE_ROOT_FROM_PACKAGE);
    const boost = boostRoot === undefined || boostRoot.length === 0
        ? { state: 'unresolved' as const, reason: '未提供 BOOST_RS_ROOT：编译器源码提交无法从题库侧探测' }
        : gitRevision(boostRoot);
    const consumerPath = pythonConsumerPath();
    const runtime = pythonRuntimeText();
    let pythonConsumer: PythonMatrixReport['identity']['pythonConsumer'];
    if (!existsSync(consumerPath) || runtime === null) {
        pythonConsumer = { state: 'unresolved', reason: 'CPython 解释器或 tools/python-consumer.py 缺失' };
    }
    else {
        try {
            pythonConsumer = { state: 'resolved', sha256: fileSha256(consumerPath), runtime };
        }
        catch (error) {
            pythonConsumer = { state: 'unresolved', reason: `消费者摘要读取失败：${String(error)}` };
        }
    }
    return {
        addon: addon.state === 'resolved'
            ? { state: 'resolved', sha256: addon.sha256 }
            : { state: 'unresolved', reason: addon.reason },
        compilerBuild: compilerBuild.state === 'resolved'
            ? { state: 'resolved', identity: compilerBuild.identity, fingerprint: compilerBuild.fingerprint }
            : { state: 'unresolved', reason: compilerBuild.reason },
        leetcodeV,
        boost,
        valkyrieV,
        pythonConsumer,
    };
}

function blockedRow(problem: ProblemDefinition, stage: PythonFailureStage, reason: string): PythonMatrixProblemRow {
    return {
        id: problem.id,
        target: PYTHON_LANE_TARGET,
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

async function probeProblem(problem: ProblemDefinition): Promise<PythonMatrixProblemRow> {
    const problemRoot = problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    const solverNote = valkyrieSolverBlockedReason(problemRoot);
    if (solverNote) {
        return blockedRow(problem, 'build', solverNote);
    }
    const projectPath = legionProjectDir(LEETCODE_ROOT_FROM_PACKAGE, problem);
    let plan;
    try {
        plan = resolveLaneTargetPlan(projectPath, PYTHON_LANE_TARGET);
    }
    catch (error) {
        return blockedRow(problem, 'build', `目标计划解析失败：${String(error)}`);
    }

    const outDir = pythonBuildDir(problem);
    mkdirSync(outDir, { recursive: true });
    // `python` 是宿主载体选择（决定产物合同为 CPython 扩展），不是平台 triple；
    // 清单里的 `target` 仍是平台 triple，因此构建用字面 `python`，证据仍按 plan 校核。
    const build = legionBuildProject(plan.solverDir, PYTHON_LANE_TARGET, outDir);
    const buildError = build.status === 0
        ? null
        : formatLegionCliError(`legion build --target ${PYTHON_LANE_TARGET}`, build);

    const artifactDir = resolveArtifactDir(outDir, plan.canonicalTarget);
    const evidence = readArtifactEvidence(artifactDir, plan);
    const resolution = resolvePythonArtifact(artifactDir);

    const row: PythonMatrixProblemRow = {
        id: problem.id,
        target: plan.canonicalTarget,
        manifestTarget: evidence.manifestTarget,
        manifestFresh: evidence.fresh,
        manifestError: evidence.reason,
        buildStatus: build.status,
        buildError,
        artifact: resolution === null
            ? null
            : {
                extension: resolution.extensionPath,
                sha256: fileSha256(resolution.extensionPath),
                moduleName: resolution.moduleName,
                exports: resolution.exports.map((entry) => ({
                    sourceName: entry.sourceName,
                    logicalName: entry.logicalName,
                    abi: entry.abi,
                    returns: entry.returns,
                })),
            },
        resolutionStage: null,
        resolutionBlocker: null,
        loadOk: false,
        executeOk: false,
        strictPass: false,
        firstFailureStage: null,
        error: null,
        command: null,
        exitStatus: null,
        caseStats: emptySolverCaseStats(null),
    };
    if (build.status !== 0) {
        row.firstFailureStage = 'build';
        row.error = buildError;
        row.caseStats = emptySolverCaseStats(buildError);
        return row;
    }
    if (resolution === null) {
        row.firstFailureStage = 'carrier';
        row.resolutionStage = 'carrier';
        row.resolutionBlocker = '执行清单未给出完整的 CPython 载体合同（abi/模块名/签名/扩展文件）';
        row.error = row.resolutionBlocker;
        row.caseStats = emptySolverCaseStats(row.error);
        return row;
    }

    const outcome = runPythonReference(problemRoot, resolution);
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
        console.error('Valkyrie N-API 未就绪：无法构建 CPython 扩展（在 valkyrie.rs 执行 cargo build -p valkyrie-napi）');
        return 2;
    }
    if (resolvePythonRuntime() === null) {
        console.error('CPython 解释器不可用：设置 LEETCODE_PYTHON 或把 python 加入 PATH');
        return 2;
    }

    const corpus = PROBLEMS.filter((problem) => hasValkyrieSolver(problemDir(LEETCODE_ROOT_FROM_PACKAGE, problem)));
    let selected: ProblemDefinition[];
    let batchLimit: number | null = limit;
    if (ids !== null) {
        selected = corpus.filter((problem) => ids.has(problem.id));
    }
    else if (mode === 'representative') {
        const wanted = new Set(PYTHON_REPRESENTATIVE_IDS);
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
            `leetcode.v=${identity.leetcodeV.state === 'resolved' ? identity.leetcodeV.rev : `UNRESOLVED(${identity.leetcodeV.reason})`} ` +
            `boost.rs=${identity.boost.state === 'resolved' ? identity.boost.rev : `UNRESOLVED(${identity.boost.reason})`} ` +
            `python=${identity.pythonConsumer.state === 'resolved' ? identity.pythonConsumer.runtime : `UNRESOLVED(${identity.pythonConsumer.reason})`}`,
    );

    const problems: PythonMatrixProblemRow[] = [];
    for (const problem of selected) {
        process.stderr.write(`python-matrix ${problem.id}…\n`);
        problems.push(await probeProblem(problem));
    }

    const report: PythonMatrixReport = {
        generatedAt: new Date().toISOString(),
        lane: 'python',
        target: PYTHON_LANE_TARGET,
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
            `target=${PYTHON_LANE_TARGET} selection=${report.selection.mode} denominator=${summary.denominator}\n` +
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
