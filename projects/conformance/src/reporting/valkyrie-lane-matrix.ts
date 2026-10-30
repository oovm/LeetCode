import type { CompileTargetPlanSource } from '../adapters/shared/compile-target-plan.ts';
import type { ArtifactRuntimeStatus } from '../adapters/shared/artifact-runtime-status.ts';
import type { ValkyrieMatrixRow } from '../adapters/valkyrie-node/matrix.ts';
import type { ValkyrieNyarMatrixRow } from '../adapters/valkyrie-nyar/matrix.ts';

export type ValkyrieLaneRow = ValkyrieMatrixRow | ValkyrieNyarMatrixRow;

export type MatrixLaneId = 'wasm' | 'nyar';

/**
 * 矩阵 lane 的身份描述。
 *
 * `wasm` 是 `0.0.x` 的交付 lane（target 由各题 `legion.von` 的 `build[].target` 声明）；
 * `nyar` 是旧 managed lane（target 由 lane 显式指定 `ovm`），其结果不是 Node/Wasm 完成度。
 */
export type MatrixLaneDescriptor = {
    id: MatrixLaneId;
    role: 'delivery' | 'legacy';
    targetSource: CompileTargetPlanSource;
    countsTowardDelivery: boolean;
    description: string;
};

export const MATRIX_LANES: readonly MatrixLaneDescriptor[] = [
    {
        id: 'wasm',
        role: 'delivery',
        targetSource: 'manifest',
        countsTowardDelivery: true,
        description: '交付 lane：compile target 由各题 legion.von 的 build[].target 声明',
    },
    {
        id: 'nyar',
        role: 'legacy',
        targetSource: 'lane-explicit',
        countsTowardDelivery: false,
        description: '旧 managed lane：compile target 由 lane 显式指定 ovm，不计入交付完成度',
    },
] as const;

/** 交付完成度只认这个 lane。 */
export const DELIVERY_LANE: MatrixLaneId = 'wasm';

export type LaneRuntimeCounts = Record<ArtifactRuntimeStatus, number>;

export type LaneMatrixSummary = {
    denominator: number;
    executed: number;
    notExecuted: number;
    green: number;
    buildPass: number;
    testPass: number;
    manifestFresh: number;
    runtimePass: number;
    runtime: LaneRuntimeCounts;
    testCaseTotal: number;
    testCasePass: number;
    testCaseFail: number;
    problemPassRate: number;
    buildPassRate: number;
    runtimePassRate: number;
    casePassRate: number;
    greenRate: number;
};

export type ValkyrieLaneMatrixReport = {
    generatedAt: string;
    batchLimit: number | null;
    denominator: number;
    corpusIds: string[];
    executedIds: string[];
    notExecutedIds: string[];
    complete: boolean;
    deliveryLane: MatrixLaneId;
    lanes: readonly MatrixLaneDescriptor[];
    summary: {
        wasm: LaneMatrixSummary;
        nyar: LaneMatrixSummary;
    };
    problems: LaneMatrixProblemEntry[];
};

export type LaneMatrixProblemEntry = {
    id: string;
    wasm: ValkyrieMatrixRow;
    nyar: ValkyrieNyarMatrixRow;
};

function summarizeLane(rows: ValkyrieLaneRow[], denominator: number): LaneMatrixSummary {
    const green = rows.filter((row) => row.green).length;
    const buildPass = rows.filter((row) => row.buildStatus === 0).length;
    const testPass = rows.filter((row) => row.testStatus === 0).length;
    const manifestFresh = rows.filter((row) => row.manifestFresh).length;
    const runtimePass = rows.filter((row) => row.runtimeOk).length;
    const runtime: LaneRuntimeCounts = { ready: 0, blocked: 0, pending: 0 };
    for (const row of rows) {
        runtime[row.runtimeStatus] += 1;
    }
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
        runtime,
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

export function buildValkyrieLaneMatrixReport(
    entries: LaneMatrixProblemEntry[],
    options: { corpusIds: readonly string[]; generatedAt?: string; batchLimit?: number | null },
): ValkyrieLaneMatrixReport {
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
        throw new Error('同一题目的 wasm 与 nyar lane 行必须绑定同一题目身份');
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
        deliveryLane: DELIVERY_LANE,
        lanes: MATRIX_LANES,
        summary: {
            wasm: summarizeLane(wasmRows, corpusIds.length),
            nyar: summarizeLane(nyarRows, corpusIds.length),
        },
        problems: entries,
    };
}
