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
    green: number;
    buildPass: number;
    testPass: number;
    manifestFresh: number;
    runtimePass: number;
    problemPassRate: number;
    buildPassRate: number;
    runtimePassRate: number;
    greenRate: number;
};

export type ValkyrieDualMatrixReport = {
    generatedAt: string;
    batchLimit: number | null;
    denominator: number;
    summary: {
        wasm: DualMatrixTargetSummary;
        nyar: DualMatrixTargetSummary;
    };
    problems: DualMatrixProblemEntry[];
};

function summarizeTarget(rows: ValkyrieTargetMatrixRow[]): DualMatrixTargetSummary {
    const denominator = rows.length;
    const green = rows.filter((row) => row.green).length;
    const buildPass = rows.filter((row) => row.buildStatus === 0).length;
    const testPass = rows.filter((row) => row.testStatus === 0).length;
    const manifestFresh = rows.filter((row) => row.manifestFresh).length;
    const runtimePass = rows.filter((row) => row.runtimeOk).length;
    const rate = (count: number) => (denominator === 0 ? 0 : count / denominator);
    return {
        denominator,
        green,
        buildPass,
        testPass,
        manifestFresh,
        runtimePass,
        problemPassRate: rate(green),
        buildPassRate: rate(buildPass),
        runtimePassRate: rate(runtimePass),
        greenRate: rate(green),
    };
}

export function buildValkyrieDualMatrixReport(
    entries: DualMatrixProblemEntry[],
    options: { generatedAt?: string; batchLimit?: number | null } = {},
): ValkyrieDualMatrixReport {
    const wasmRows = entries.map((entry) => entry.wasm);
    const nyarRows = entries.map((entry) => entry.nyar);
    return {
        generatedAt: options.generatedAt ?? new Date().toISOString(),
        batchLimit: options.batchLimit ?? null,
        denominator: entries.length,
        summary: {
            wasm: summarizeTarget(wasmRows),
            nyar: summarizeTarget(nyarRows),
        },
        problems: entries,
    };
}
