#!/usr/bin/env node
/** 生成 `leetcode.v` Valkyrie 双 target（wasm + nyar）可重复通过率矩阵报告。 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PROBLEMS, legionProjectDir, problemDir } from '../catalog/index.ts';
import { hasValkyrieSolver } from '../adapters/valkyrie-node/valkyrie.ts';
import { probeValkyrieProblem } from '../adapters/valkyrie-node/matrix.ts';
import { probeValkyrieNyarProblem } from '../adapters/valkyrie-nyar/matrix.ts';
import { valkyrieNativeRunnerReady, valkyrieNativeSkipReason } from '../adapters/valkyrie-node/valkyrie.ts';
import { valkyrieNyarRunnerReady, valkyrieNyarSkipReason } from '../adapters/valkyrie-nyar/valkyrie.ts';
import { parseBatchLimit, problemsForBatch } from '../planning/batch-limit.ts';
import { buildValkyrieDualMatrixReport } from '../reporting/valkyrie-dual-matrix.ts';

const CONFORMANCE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const LEETCODE_ROOT = join(CONFORMANCE_ROOT, '..', '..');
const DEFAULT_REPORT_PATH = join(CONFORMANCE_ROOT, 'reports', 'valkyrie-dual-matrix.json');

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
        process.stderr.write(`matrix ${problem.id} wasm+nyar…\n`);
        const wasm = await probeValkyrieProblem(problem, projectPath);
        const nyar = await probeValkyrieNyarProblem(problem, projectPath);
        entries.push({ id: problem.id, wasm, nyar });
    }

    const report = buildValkyrieDualMatrixReport(entries, {
        corpusIds: corpus.map((problem) => problem.id),
        batchLimit,
    });
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

    const wasm = report.summary.wasm;
    const nyar = report.summary.nyar;
    console.log(
        `wrote ${outPath}\n` +
            `denominator=${report.denominator} executed=${report.executedIds.length} notExecuted=${report.notExecutedIds.length} complete=${report.complete} batchLimit=${batchLimit ?? 'all'}\n` +
            `wasm green ${wasm.green}/${wasm.denominator} (${(wasm.greenRate * 100).toFixed(1)}%) ` +
            `cases ${wasm.testCasePass}/${wasm.testCaseTotal} (${(wasm.casePassRate * 100).toFixed(1)}%)\n` +
            `nyar green ${nyar.green}/${nyar.denominator} (${(nyar.greenRate * 100).toFixed(1)}%) ` +
            `cases ${nyar.testCasePass}/${nyar.testCaseTotal} (${(nyar.casePassRate * 100).toFixed(1)}%)`,
    );
    return 0;
}

main().catch((err) => {
    console.error(String(err));
    process.exit(1);
});
