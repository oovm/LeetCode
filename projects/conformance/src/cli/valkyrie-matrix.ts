#!/usr/bin/env node
/**
 * 生成 Valkyrie lane 矩阵报告（`wasm` 交付 lane + `ovm` 执行 lane + `jvm`/`clr` 对照 lane）。
 *
 * target 来源不同：wasm 由各题 `legion.von` 的 `build[].target` 声明；
 * ovm/jvm/clr 由 lane 显式指定并经 `legionPlan` 结构化规范化。
 * 只有 wasm lane 参与 `0.0.x` 交付完成度统计；各 lane 独立探测、独立计数，互不顶替。
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PROBLEMS, legionProjectDir, problemDir } from '../catalog/index.ts';
import { hasValkyrieSolver } from '../adapters/valkyrie-node/valkyrie.ts';
import { probeValkyrieProblem } from '../adapters/valkyrie-node/matrix.ts';
import { probeValkyrieBackendProblem } from '../adapters/valkyrie-backend/matrix.ts';
import { valkyrieNativeRunnerReady, valkyrieNativeSkipReason } from '../adapters/valkyrie-node/valkyrie.ts';
import { valkyrieNyarRunnerReady, valkyrieNyarSkipReason } from '../adapters/valkyrie-nyar/valkyrie.ts';
import { parseBatchLimit, problemsForBatch } from '../planning/batch-limit.ts';
import { buildValkyrieLaneMatrixReport, type LaneQuarantine, type MatrixInputIdentity } from '../reporting/valkyrie-lane-matrix.ts';
import { loadCorpusQuarantine } from '../reporting/corpus-quarantine.ts';
import { resolveAddonIdentity, resolveCompilerBuildIdentity } from '../observation/toolchain-identity.ts';

const CONFORMANCE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LEETCODE_ROOT = join(CONFORMANCE_ROOT, '..', '..');
/** 历史报告路径保持不变，避免丢失既有报告数据；内容已按 lane 分类。 */
const DEFAULT_REPORT_PATH = join(CONFORMANCE_ROOT, 'reports', 'valkyrie-dual-matrix.json');
/** 隔离坐标来自侧车缺陷清单；清单缺失即不隔离，整体撤销只需删除该清单。 */
const QUARANTINE_MANIFEST = join(CONFORMANCE_ROOT, 'reports', 'valkyrie-corpus-precision-defects.json');

function resolveQuarantine(): LaneQuarantine | null {
    const quarantine = loadCorpusQuarantine(QUARANTINE_MANIFEST, 'reports/valkyrie-corpus-precision-defects.json');
    if (!quarantine) {
        return null;
    }
    const indices = new Map<string, ReadonlySet<number>>();
    for (const [slug, cases] of quarantine.byProblem) {
        indices.set(slug, new Set(cases.keys()));
    }
    return { source: quarantine.source, caseCount: quarantine.caseCount, problemCount: quarantine.problemCount, indices };
}

/**
 * 采集本次矩阵的输入身份：native addon（sha256/mtime）、addon 内嵌编译器构建身份
 * （nyar rev）、V 语料 checkout 的 git rev（`VALKYRIE_V_ROOT`，缺省取同级 valkyrie.v）。
 * 任一身份不可解析时如实记录 unresolved，不伪造、不回退旧值。
 */
function resolveInputIdentity(): MatrixInputIdentity {
    const addon = resolveAddonIdentity();
    const compilerBuild = resolveCompilerBuildIdentity();
    const valkyrieVRoot = process.env.VALKYRIE_V_ROOT?.trim() || join(LEETCODE_ROOT, '..', 'valkyrie.v');
    let valkyrieV: MatrixInputIdentity['valkyrieV'];
    try {
        const probe = spawnSync('git', ['-C', valkyrieVRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' });
        const rev = probe.status === 0 ? probe.stdout.trim() : '';
        valkyrieV = rev.length > 0
            ? { state: 'resolved', rev }
            : { state: 'unresolved', reason: `git rev-parse HEAD 失败：${probe.stderr?.trim() || `status=${probe.status}`}` };
    } catch (err) {
        valkyrieV = { state: 'unresolved', reason: `valkyrie.v rev 读取失败：${err instanceof Error ? err.message : String(err)}` };
    }
    return {
        addon: addon.state === 'resolved'
            ? { state: 'resolved', sha256: addon.sha256, mtimeIso: addon.mtimeIso }
            : { state: 'unresolved', reason: addon.reason },
        compilerBuild: compilerBuild.state === 'resolved'
            ? { state: 'resolved', identity: compilerBuild.identity, fingerprint: compilerBuild.fingerprint }
            : { state: 'unresolved', reason: compilerBuild.reason },
        valkyrieV,
    };
}

function parseArgs(argv: string[]): { outPath: string; idFilter: string | null } {
    let outPath = DEFAULT_REPORT_PATH;
    let idFilter: string | null = null;
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--out' && argv[index + 1]) {
            outPath = argv[index + 1];
            index += 1;
            continue;
        }
        if ((arg === '--id' || arg === '-i') && argv[index + 1]) {
            idFilter = argv[index + 1];
            index += 1;
        }
    }
    return { outPath, idFilter };
}

async function main(): Promise<number> {
    const { outPath, idFilter } = parseArgs(process.argv.slice(2));
    if (!valkyrieNativeRunnerReady()) {
        console.error(valkyrieNativeSkipReason() ?? 'Valkyrie wasm runner 未就绪');
        return 2;
    }
    if (!valkyrieNyarRunnerReady()) {
        console.error(valkyrieNyarSkipReason() ?? 'Valkyrie nyar runner 未就绪');
        return 2;
    }

    // 输入身份在矩阵开始前采集：长跑期间 V checkout 可能前进，报告必须绑定实际起跑 rev。
    const identity = resolveInputIdentity();
    console.log(`identity addon=${identity.addon.state === 'resolved' ? identity.addon.sha256 : `UNRESOLVED(${identity.addon.reason})`} compiler-build=${identity.compilerBuild.state === 'resolved' ? identity.compilerBuild.identity : `UNRESOLVED(${identity.compilerBuild.reason})`} valkyrie.v=${identity.valkyrieV.state === 'resolved' ? identity.valkyrieV.rev : `UNRESOLVED(${identity.valkyrieV.reason})`}`);

    const batchLimit = parseBatchLimit({ fallbackKeys: ['LEETCODE_MATRIX_LIMIT', 'LEETCODE_BENCH_LIMIT'] });
    const corpus = PROBLEMS.filter((problem) => hasValkyrieSolver(problemDir(LEETCODE_ROOT, problem)));
    let candidates = corpus;
    if (idFilter) {
        candidates = candidates.filter((problem) => problem.id === idFilter);
    }
    candidates = problemsForBatch(candidates, {
        fallbackKeys: ['LEETCODE_MATRIX_LIMIT', 'LEETCODE_BENCH_LIMIT'],
    });

    const entries = [];
    for (const problem of candidates) {
        const projectPath = legionProjectDir(LEETCODE_ROOT, problem);
        process.stderr.write(`matrix ${problem.id} lane wasm…\n`);
        const wasm = await probeValkyrieProblem(problem, projectPath);
        process.stderr.write(`matrix ${problem.id} lane ovm…\n`);
        const ovm = await probeValkyrieBackendProblem(problem, projectPath, 'ovm');
        process.stderr.write(`matrix ${problem.id} lane jvm…\n`);
        const jvm = await probeValkyrieBackendProblem(problem, projectPath, 'jvm');
        process.stderr.write(`matrix ${problem.id} lane clr…\n`);
        const clr = await probeValkyrieBackendProblem(problem, projectPath, 'clr');
        entries.push({ id: problem.id, rows: { wasm, ovm, jvm, clr } });
    }

    const report = buildValkyrieLaneMatrixReport(entries, {
        corpusIds: corpus.map((problem) => problem.id),
        batchLimit,
        quarantine: resolveQuarantine(),
    });
    report.identity = identity;
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

    const laneLine = (label: string, summary: (typeof report.summary)['wasm'], note: string) =>
        `lane ${label}: green ${summary.green}/${summary.denominator} ` +
        `(${(summary.greenRate * 100).toFixed(1)}%) red ${summary.red} unverified ${summary.unverified} ` +
        `cases pass ${summary.executed_pass}/${summary.testCaseTotal} ` +
        `(${(summary.casePassRate * 100).toFixed(1)}%) executed_fail ${summary.executed_fail} ` +
        `blocked ${summary.blocked} not_run ${summary.not_run} skipped ${summary.skipped} ` +
        `(timeout ${summary.skipped_timeout}, integer-abi ${summary.skipped_integer_argument}) ` +
        `runtime ready/blocked/pending ` +
        `${summary.runtime.ready}/${summary.runtime.blocked}/${summary.runtime.pending} ${note}`;
    const unverifiedLines = report.lanes
        .filter((lane) => report.summary[lane.id].unverifiedIds.length > 0)
        .map(
            (lane) =>
                `unverified ${lane.id}: ${report.summary[lane.id].unverified}/${report.denominator} 题 ` +
                `(${report.summary[lane.id].unverifiedIds.join(', ')})`,
        );
    const laneNotes: Record<string, string> = {
        wasm: '(delivery, target=manifest-declared)',
        ovm: '(execution, target=lane-explicit ovm, 不计入完成度)',
        jvm: '(contrast, target=lane-explicit jvm, 不计入完成度)',
        clr: '(contrast, target=lane-explicit clr, 不计入完成度)',
    };
    console.log(
        `wrote ${outPath}\n` +
            `denominator=${report.denominator} executed=${report.executedIds.length} notExecuted=${report.notExecutedIds.length} complete=${report.complete} batchLimit=${batchLimit ?? 'all'}\n` +
            `quarantine=${report.quarantine ? `${report.quarantine.caseCount} cases / ${report.quarantine.problemCount} problems (excluded from case totals, source=${report.quarantine.source})` : 'none'}\n` +
            `delivery lane: ${report.deliveryLane}（只有该 lane 计入交付完成度）\n` +
            report.lanes.map((lane) => laneLine(lane.id, report.summary[lane.id], laneNotes[lane.id] ?? '')).join('\n') +
            (unverifiedLines.length > 0 ? `\n${unverifiedLines.join('\n')}` : ''),
    );
    return 0;
}

main().catch((err) => {
    console.error(String(err));
    process.exit(1);
});
