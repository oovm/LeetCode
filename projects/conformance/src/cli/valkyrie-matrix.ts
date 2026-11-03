#!/usr/bin/env node
/**
 * 生成 Valkyrie lane 矩阵报告（`wasm` 交付 lane + `ovm` 执行 lane + `jvm`/`clr` 对照 lane）。
 *
 * target 来源不同：wasm 由各题 `legion.von` 的 `build[].target` 声明；
 * ovm/jvm/clr 由 lane 显式指定并经 `legionPlan` 结构化规范化。
 * 只有 wasm lane 参与 `0.0.x` 交付完成度统计；各 lane 独立探测、独立计数，互不顶替。
 */
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
import { buildValkyrieLaneMatrixReport, type LaneQuarantine } from '../reporting/valkyrie-lane-matrix.ts';
import { loadCorpusQuarantine } from '../reporting/corpus-quarantine.ts';

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
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

    const laneLine = (label: string, summary: (typeof report.summary)['wasm'], note: string) =>
        `lane ${label}: green ${summary.green}/${summary.denominator} ` +
        `(${(summary.greenRate * 100).toFixed(1)}%) cases pass ${summary.executed_pass}/${summary.testCaseTotal} ` +
        `(${(summary.casePassRate * 100).toFixed(1)}%) executed_fail ${summary.executed_fail} ` +
        `blocked ${summary.blocked} not_run ${summary.not_run} runtime ready/blocked/pending ` +
        `${summary.runtime.ready}/${summary.runtime.blocked}/${summary.runtime.pending} ${note}`;
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
            report.lanes.map((lane) => laneLine(lane.id, report.summary[lane.id], laneNotes[lane.id] ?? '')).join('\n'),
    );
    return 0;
}

main().catch((err) => {
    console.error(String(err));
    process.exit(1);
});
