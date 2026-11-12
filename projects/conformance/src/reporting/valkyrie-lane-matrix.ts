import type { CompileTargetPlanSource } from '../adapters/shared/compile-target-plan.ts';
import type { ArtifactRuntimeStatus } from '../adapters/shared/artifact-runtime-status.ts';
import { classifyMatrixOutcome } from '../adapters/shared/solver-case-stats.ts';
import type { ValkyrieMatrixRow } from '../adapters/valkyrie-node/matrix.ts';
import type { ValkyrieBackendMatrixRow } from '../adapters/valkyrie-backend/matrix.ts';

import { quarantineCaseStats } from './corpus-quarantine.ts';

export type ValkyrieLaneRow = ValkyrieMatrixRow | ValkyrieBackendMatrixRow;

export type MatrixLaneId = 'wasm' | 'ovm' | 'jvm' | 'clr';

/**
 * 矩阵 lane 的身份描述。
 *
 * `wasm` 是 `0.0.x` 的交付 lane（target 由各题 `legion.von` 的 `build[].target` 声明）；
 * `ovm` 是执行 lane（lane 显式指定 `ovm`，legion 内置 OVM 跑参考）；
 * `jvm` / `clr` 是对照 lane（lane 显式指定 target，外部 runner 执行，用于防止单一 target 过拟合）。
 * 三条非交付 lane 的结果都不计入交付完成度，且彼此独立推导、互不顶替。
 */
export type MatrixLaneDescriptor = {
    id: MatrixLaneId;
    role: 'delivery' | 'execution' | 'contrast';
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
        id: 'ovm',
        role: 'execution',
        targetSource: 'lane-explicit',
        countsTowardDelivery: false,
        description: '执行 lane：compile target 由 lane 显式指定 ovm，legion 内置 OVM 跑参考，不计入交付完成度',
    },
    {
        id: 'jvm',
        role: 'contrast',
        targetSource: 'lane-explicit',
        countsTowardDelivery: false,
        description: '对照 lane：compile target 由 lane 显式指定 jvm，外部 JVM runner 执行，防止单一 target 过拟合，不计入交付完成度',
    },
    {
        id: 'clr',
        role: 'contrast',
        targetSource: 'lane-explicit',
        countsTowardDelivery: false,
        description: '对照 lane：compile target 由 lane 显式指定 clr，外部 CLR runner 执行，防止单一 target 过拟合，不计入交付完成度',
    },
] as const;

export const MATRIX_LANE_IDS: readonly MatrixLaneId[] = MATRIX_LANES.map((lane) => lane.id);

/** 交付完成度只认这个 lane。 */
export const DELIVERY_LANE: MatrixLaneId = 'wasm';

export type LaneRuntimeCounts = Record<ArtifactRuntimeStatus, number>;

/** 侧车隔离坐标：slug → 被排除的 cases 真源 `<slug>.cases.ts` 下标。 */
export type LaneQuarantine = {
    source: string;
    caseCount: number;
    problemCount: number;
    indices: ReadonlyMap<string, ReadonlySet<number>>;
};

export type LaneMatrixSummary = {
    denominator: number;
    executed: number;
    notExecuted: number;
    green: number;
    /** 真实失败的行数：只含 `executed_fail` 或 build/manifest 失败，不吞掉未验证。 */
    red: number;
    /** 未验证的行数：仍有用例未执行，但没有任何真实失败。 */
    unverified: number;
    /** 未验证的题目 id，题级显式列出；与 `summary.unverified` 计数一致。 */
    unverifiedIds: string[];
    buildPass: number;
    manifestFresh: number;
    runtimePass: number;
    runtime: LaneRuntimeCounts;
    testCaseTotal: number;
    executed_pass: number;
    executed_fail: number;
    blocked: number;
    not_run: number;
    /** 没有可执行期望、已从 `casePassRate` 分母排除的用例数。 */
    skipped: number;
    /** `skipped` 中因 `Execution timed out` 哨兵的条数。 */
    skipped_timeout: number;
    /** `skipped` 中因整数 ABI 送不进非整数实参的条数。 */
    skipped_integer_argument: number;
    /** 从 `testCaseTotal` 与四字段中剔除的隔离用例数。 */
    quarantinedCases: number;
    /** 因缺逐例记录而无法扣减的隔离坐标数（禁止从汇总倒推，如实上报）。 */
    quarantineUnbound: number;
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
    summary: Record<MatrixLaneId, LaneMatrixSummary>;
    problems: LaneMatrixProblemEntry[];
    /** 本次报告实际生效的隔离清单；未配置时为 null。 */
    quarantine: { source: string; caseCount: number; problemCount: number } | null;
};

export type LaneMatrixProblemEntry = {
    id: string;
    rows: Record<MatrixLaneId, ValkyrieLaneRow>;
};

function summarizeLane(
    entries: LaneMatrixProblemEntry[],
    lane: MatrixLaneId,
    denominator: number,
    baselineRows?: ValkyrieLaneRow[],
): LaneMatrixSummary {
    const rows = entries.map((entry) => entry.rows[lane]);
    // 三态逐行判定：绿 / 红 / 未验证。未验证不计入失败，但必须计数并列出题目。
    const outcomes = rows.map((row) => classifyMatrixOutcome(row));
    const green = outcomes.filter((outcome) => outcome === 'green').length;
    const unverified = outcomes.filter((outcome) => outcome === 'unverified').length;
    const red = outcomes.filter((outcome) => outcome === 'red').length;
    const unverifiedIds = entries
        .filter((entry) => classifyMatrixOutcome(entry.rows[lane]) === 'unverified')
        .map((entry) => entry.id);
    const buildPass = rows.filter((row) => row.buildStatus === 0).length;
    const manifestFresh = rows.filter((row) => row.manifestFresh).length;
    const runtimePass = rows.filter((row) => row.runtimeOk).length;
    const runtime: LaneRuntimeCounts = { ready: 0, blocked: 0, pending: 0 };
    for (const row of rows) {
        runtime[row.runtimeStatus] += 1;
    }
    const testCaseTotal = rows.reduce((sum, row) => sum + row.testCaseTotal, 0);
    const baselineTotal = baselineRows ? baselineRows.reduce((sum, row) => sum + row.testCaseTotal, 0) : testCaseTotal;
    const executedPass = rows.reduce((sum, row) => sum + row.executed_pass, 0);
    const executedFail = rows.reduce((sum, row) => sum + row.executed_fail, 0);
    const blocked = rows.reduce((sum, row) => sum + row.blocked, 0);
    const notRun = rows.reduce((sum, row) => sum + row.not_run, 0);
    const skipped = rows.reduce((sum, row) => sum + (row.skipped ?? 0), 0);
    const skippedTimeout = rows.reduce((sum, row) => sum + (row.skipped_timeout ?? 0), 0);
    const skippedIntegerArgument = rows.reduce((sum, row) => sum + (row.skipped_integer_argument ?? 0), 0);
    const quarantineUnbound = rows.reduce((sum, row) => sum + (row.quarantine?.unbound ?? 0), 0);
    const rate = (count: number, denom = denominator) => (denom === 0 ? 0 : count / denom);
    return {
        denominator,
        executed: rows.length,
        notExecuted: denominator - rows.length,
        green,
        red,
        unverified,
        unverifiedIds,
        buildPass,
        manifestFresh,
        runtimePass,
        runtime,
        testCaseTotal,
        executed_pass: executedPass,
        executed_fail: executedFail,
        blocked,
        not_run: notRun,
        skipped,
        skipped_timeout: skippedTimeout,
        skipped_integer_argument: skippedIntegerArgument,
        quarantinedCases: baselineTotal - testCaseTotal,
        quarantineUnbound,
        problemPassRate: rate(green),
        buildPassRate: rate(buildPass),
        runtimePassRate: rate(runtimePass),
        casePassRate: rate(executedPass, testCaseTotal),
        greenRate: rate(green),
    };
}

export function buildValkyrieLaneMatrixReport(
    entries: LaneMatrixProblemEntry[],
    options: {
        corpusIds: readonly string[];
        generatedAt?: string;
        batchLimit?: number | null;
        /** 侧车隔离坐标；命中题目的用例从行级分母与四字段里剔除。 */
        quarantine?: LaneQuarantine | null;
    },
): ValkyrieLaneMatrixReport {
    const corpusIds = [...options.corpusIds];
    const corpus = new Set(corpusIds);
    const quarantine = options.quarantine ?? null;
    const appliedEntries = quarantine
        ? entries.map((entry) => {
            const indices = quarantine.indices.get(entry.id);
            if (!indices || indices.size === 0) {
                return entry;
            }
            const adjust = (row: ValkyrieLaneRow): ValkyrieLaneRow => {
                const adjustment = quarantineCaseStats(row, indices);
                return { ...row, ...adjustment.stats, quarantine: { removed: adjustment.removed, unbound: adjustment.unbound } };
            };
            return {
                id: entry.id,
                rows: {
                    wasm: adjust(entry.rows.wasm),
                    ovm: adjust(entry.rows.ovm),
                    jvm: adjust(entry.rows.jvm),
                    clr: adjust(entry.rows.clr),
                },
            };
        })
        : entries;
    const executedIds = appliedEntries.map((entry) => entry.id);
    const executed = new Set(executedIds);
    if (corpus.size !== corpusIds.length || executed.size !== executedIds.length) {
        throw new Error('矩阵总体与执行范围不得包含重复题目身份');
    }
    if (executedIds.some((id) => !corpus.has(id))) {
        throw new Error('执行题目必须属于固定总体');
    }
    for (const entry of appliedEntries) {
        for (const lane of MATRIX_LANE_IDS) {
            if (entry.rows[lane]?.id !== entry.id) {
                throw new Error(`题目 ${entry.id} 缺少 ${lane} lane 行或 lane 行绑定了错误题目身份`);
            }
        }
    }
    const notExecutedIds = corpusIds.filter((id) => !executed.has(id));
    const summary = Object.fromEntries(
        MATRIX_LANE_IDS.map((lane) => [
            lane,
            summarizeLane(
                appliedEntries,
                lane,
                corpusIds.length,
                quarantine ? entries.map((entry) => entry.rows[lane]) : undefined,
            ),
        ]),
    ) as Record<MatrixLaneId, LaneMatrixSummary>;
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
        summary,
        problems: appliedEntries,
        quarantine: quarantine
            ? { source: quarantine.source, caseCount: quarantine.caseCount, problemCount: quarantine.problemCount }
            : null,
    };
}
