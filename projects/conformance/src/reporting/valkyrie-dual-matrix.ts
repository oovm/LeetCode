import type { ValkyrieMatrixRow } from '../adapters/valkyrie-node/matrix.ts';
import type { ValkyrieNyarMatrixRow } from '../adapters/valkyrie-nyar/matrix.ts';

export type ValkyrieTargetMatrixRow = ValkyrieMatrixRow | ValkyrieNyarMatrixRow;

export type DualMatrixProblemEntry = {
    id: string;
    wasm: ValkyrieMatrixRow;
    nyar: ValkyrieNyarMatrixRow;
};

export type DualMatrixTargetSummary = {
    denominator: number;
    executed: number;
    notExecuted: number;
    green: number;
    buildPass: number;
    testPass: number;
    manifestFresh: number;
    runtimePass: number;
    testCaseTotal: number;
    testCasePass: number;
    testCaseFail: number;
    problemPassRate: number;
    buildPassRate: number;
    runtimePassRate: number;
    casePassRate: number;
    greenRate: number;
};

export type ValkyrieDualMatrixReport = {
    generatedAt: string;
    batchLimit: number | null;
    denominator: number;
    corpusIds: string[];
    executedIds: string[];
    notExecutedIds: string[];
    complete: boolean;
    summary: {
        wasm: DualMatrixTargetSummary;
        nyar: DualMatrixTargetSummary;
    };
    problems: DualMatrixProblemEntry[];
};

function summarizeTarget(rows: ValkyrieTargetMatrixRow[], denominator: number): DualMatrixTargetSummary {
    const green = rows.filter((row) => row.green).length;
    const buildPass = rows.filter((row) => row.buildStatus === 0).length;
    const testPass = rows.filter((row) => row.testStatus === 0).length;
    const manifestFresh = rows.filter((row) => row.manifestFresh).length;
    const runtimePass = rows.filter((row) => row.runtimeOk).length;
    const testCaseTotal = rows.reduce((sum, row) => sum + row.testCaseTotal, 0);
    const testCasePass = rows.reduce((sum, row) => sum + row.testCasePass, 0);
    const testCaseFail = rows.reduce((sum, row) => sum + row.testCaseFail, 0);
    const rate = (count: number, denom = denominator) => (denom === 0 ? 0 : count / denom);
    return {
        denominator,
        executed: rows.length,
        notExecuted: denominator - rows.length,
        green,
        buildPass,
        testPass,
        manifestFresh,
        runtimePass,
        testCaseTotal,
        testCasePass,
        testCaseFail,
        problemPassRate: rate(green),
        buildPassRate: rate(buildPass),
        runtimePassRate: rate(runtimePass),
        casePassRate: rate(testCasePass, testCaseTotal),
        greenRate: rate(green),
    };
}

export function buildValkyrieDualMatrixReport(
    entries: DualMatrixProblemEntry[],
    options: { corpusIds: readonly string[]; generatedAt?: string; batchLimit?: number | null },
): ValkyrieDualMatrixReport {
    const corpusIds = [...options.corpusIds];
    const corpus = new Set(corpusIds);
    const executedIds = entries.map((entry) => entry.id);
    const executed = new Set(executedIds);
    if (corpus.size !== corpusIds.length || executed.size !== executedIds.length) {
        throw new Error('矩阵总体与执行范围不得包含重复题目身份');
    }
    if (executedIds.some((id) => !corpus.has(id))) {
        throw new Error('执行题目必须属于固定总体');
    }
    if (entries.some((entry) => entry.wasm.id !== entry.id || entry.nyar.id !== entry.id)) {
        throw new Error('双 target 行必须绑定同一题目身份');
    }
    const notExecutedIds = corpusIds.filter((id) => !executed.has(id));
    const wasmRows = entries.map((entry) => entry.wasm);
    const nyarRows = entries.map((entry) => entry.nyar);
    return {
        generatedAt: options.generatedAt ?? new Date().toISOString(),
        batchLimit: options.batchLimit ?? null,
        denominator: corpusIds.length,
        corpusIds,
        executedIds,
        notExecutedIds,
        complete: notExecutedIds.length === 0,
        summary: {
            wasm: summarizeTarget(wasmRows, corpusIds.length),
            nyar: summarizeTarget(nyarRows, corpusIds.length),
        },
        problems: entries,
    };
}
