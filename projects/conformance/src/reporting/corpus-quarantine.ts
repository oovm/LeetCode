import { existsSync, readFileSync } from 'node:fs';

import type { CaseRecord, CaseRecordStatus, SolverCaseStats } from '../adapters/shared/solver-case-stats.ts';

/**
 * 可执行隔离的缺陷类。
 *
 * - `A` args 精度丢失，用例无法表达。
 * - `B` expected 精度丢失，会制造假失败。
 * - `C` 精确大整数但超出 `i64` 表示 / 官方约束。
 * - `S` 语义性语料错误（不是精度问题，例如存的是未取模计数）。
 *
 * `D` 是正常值，永不隔离。
 */
export const QUARANTINE_CLASSES: readonly string[] = ['A', 'B', 'C', 'S'];

export type CorpusQuarantineEntry = {
    testIndex: number;
    classes: readonly string[];
};

export type CorpusQuarantine = {
    source: string;
    problemCount: number;
    caseCount: number;
    byProblem: ReadonlyMap<string, ReadonlyMap<number, CorpusQuarantineEntry>>;
};

type DefectsManifest = {
    cases?: readonly { slug?: unknown; class?: unknown; field?: unknown }[];
};

const TEST_COORDINATE = /^tests\[(\d+)\]\./;

/**
 * 从精度缺陷清单解析隔离坐标。
 *
 * 清单是侧车 manifest：坐标只标识 cases 真源 `<slug>.cases.ts` 下标（与清理前 metadata 原始顺序一致），不改判题数据。
 * 类不在 `QUARANTINE_CLASSES` 的条目（`D`）忽略。
 */
export function parseCorpusQuarantine(text: string, source: string): CorpusQuarantine {
    const manifest = JSON.parse(text) as DefectsManifest;
    const byProblem = new Map<string, Map<number, CorpusQuarantineEntry>>();
    for (const defect of manifest.cases ?? []) {
        const slug = defect.slug;
        const defectClass = defect.class;
        const field = defect.field;
        if (typeof slug !== 'string' || typeof defectClass !== 'string' || typeof field !== 'string') {
            continue;
        }
        if (!QUARANTINE_CLASSES.includes(defectClass)) {
            continue;
        }
        const match = field.match(TEST_COORDINATE);
        if (!match) {
            continue;
        }
        const testIndex = Number(match[1]);
        let cases = byProblem.get(slug);
        if (!cases) {
            cases = new Map();
            byProblem.set(slug, cases);
        }
        const existing = cases.get(testIndex);
        if (existing) {
            const classes = new Set(existing.classes);
            classes.add(defectClass);
            cases.set(testIndex, { testIndex, classes: [...classes].sort() });
        } else {
            cases.set(testIndex, { testIndex, classes: [defectClass] });
        }
    }
    let caseCount = 0;
    for (const cases of byProblem.values()) {
        caseCount += cases.size;
    }
    return { source, problemCount: byProblem.size, caseCount, byProblem };
}

/** 清单缺失时返回 `null`（不隔离）；存在但损坏时抛错，不静默放过。 */
export function loadCorpusQuarantine(manifestPath: string, source = manifestPath): CorpusQuarantine | null {
    if (!existsSync(manifestPath)) {
        return null;
    }
    return parseCorpusQuarantine(readFileSync(manifestPath, 'utf8'), source);
}

type CaseBuckets = Pick<SolverCaseStats, 'executed_pass' | 'executed_fail' | 'blocked' | 'not_run'>;

/**
 * 被隔离项的逐例绑定证据：身份 + 内容摘要 + 真实逐例状态。
 * 摘要来自 solver 的逐例记录，隔离项因此绑定 case 内容；语料内容变化后
 * 旧隔离坐标的摘要不再可比，报告必须如实呈现。
 */
export type QuarantineRemoval = {
    index: number;
    caseId: string;
    digest: string;
    status: CaseRecordStatus;
};

export type QuarantineAdjustment = {
    stats: SolverCaseStats;
    /** 实际扣减的隔离项（逐例状态与摘要来自真实记录）。 */
    removed: QuarantineRemoval[];
    /** 无逐例记录而无法安全扣减的坐标数（禁止从汇总计数倒推逐例状态）。 */
    unbound: number;
};

/** 汇总计数与逐例记录必须一致；不一致说明观测链自身失真，立即失败。 */
function assertCasesConsistent(stats: SolverCaseStats, records: CaseRecord[]): void {
    const count = (status: CaseRecordStatus) => records.filter((record) => record.status === status).length;
    const countSkipped = (reason: 'timeout' | 'integer-argument') =>
        records.filter((record) => record.status === 'skipped' && record.skipped_reason === reason).length;
    const mismatches: string[] = [];
    if (records.length !== stats.testCaseTotal) {
        mismatches.push(`记录数 ${records.length} !== testCaseTotal ${stats.testCaseTotal}`);
    }
    if (count('pass') !== stats.executed_pass) {
        mismatches.push(`pass 记录 ${count('pass')} !== executed_pass ${stats.executed_pass}`);
    }
    if (count('fail') !== stats.executed_fail) {
        mismatches.push(`fail 记录 ${count('fail')} !== executed_fail ${stats.executed_fail}`);
    }
    if (count('blocked') !== stats.blocked) {
        mismatches.push(`blocked 记录 ${count('blocked')} !== blocked ${stats.blocked}`);
    }
    if (count('not_run') !== stats.not_run) {
        mismatches.push(`not_run 记录 ${count('not_run')} !== not_run ${stats.not_run}`);
    }
    if (count('skipped') !== (stats.skipped ?? 0)) {
        mismatches.push(`skipped 记录 ${count('skipped')} !== skipped ${stats.skipped ?? 0}`);
    }
    if (countSkipped('timeout') !== (stats.skipped_timeout ?? 0)) {
        mismatches.push(`timeout 记录 ${countSkipped('timeout')} !== skipped_timeout ${stats.skipped_timeout ?? 0}`);
    }
    if (countSkipped('integer-argument') !== (stats.skipped_integer_argument ?? 0)) {
        mismatches.push(
            `integer-argument 记录 ${countSkipped('integer-argument')} !== skipped_integer_argument ${stats.skipped_integer_argument ?? 0}`,
        );
    }
    if (mismatches.length > 0) {
        throw new Error(`逐例记录与汇总计数不一致（观测链失真，拒绝倒推）：${mismatches.join('；')}`);
    }
}

/**
 * 按坐标把隔离用例从统计里扣掉。
 *
 * 逐例状态只来自 solver 的真实记录（`cases`），禁止从汇总计数或 `firstFailureIndex`
 * 区间倒推。无逐例记录时不扣减，坐标计入 `unbound` 如实上报。越界下标（清单与
 * 当前 metadata 不一致）不计入，避免凭空减少用例。
 */
export function quarantineCaseStats(stats: SolverCaseStats, indices: ReadonlySet<number>): QuarantineAdjustment {
    const inRange = [...indices].filter((index) => Number.isInteger(index) && index >= 0 && index < stats.testCaseTotal);
    const records = stats.cases;
    if (records === undefined || records.length === 0) {
        return { stats, removed: [], unbound: inRange.length };
    }
    assertCasesConsistent(stats, records);
    const byIndex = new Map<number, CaseRecord>();
    for (const record of records) {
        byIndex.set(record.index, record);
    }
    const removed: QuarantineRemoval[] = [];
    const buckets: CaseBuckets = { executed_pass: 0, executed_fail: 0, blocked: 0, not_run: 0 };
    let removedSkipped = 0;
    let removedSkippedTimeout = 0;
    let removedSkippedIntegerArgument = 0;
    for (const index of inRange) {
        const record = byIndex.get(index);
        if (record === undefined) {
            continue;
        }
        removed.push({ index: record.index, caseId: record.caseId, digest: record.digest, status: record.status });
        switch (record.status) {
            case 'pass':
                buckets.executed_pass += 1;
                break;
            case 'fail':
                buckets.executed_fail += 1;
                break;
            case 'blocked':
                buckets.blocked += 1;
                break;
            case 'not_run':
                buckets.not_run += 1;
                break;
            case 'skipped':
                removedSkipped += 1;
                if (record.skipped_reason === 'timeout') {
                    removedSkippedTimeout += 1;
                }
                if (record.skipped_reason === 'integer-argument') {
                    removedSkippedIntegerArgument += 1;
                }
                break;
        }
    }
    const removedIndices = new Set(removed.map((item) => item.index));
    return {
        stats: {
            ...stats,
            testCaseTotal: stats.testCaseTotal - removed.length,
            executed_pass: stats.executed_pass - buckets.executed_pass,
            executed_fail: stats.executed_fail - buckets.executed_fail,
            blocked: stats.blocked - buckets.blocked,
            not_run: stats.not_run - buckets.not_run,
            skipped: (stats.skipped ?? 0) - removedSkipped,
            skipped_timeout: (stats.skipped_timeout ?? 0) - removedSkippedTimeout,
            skipped_integer_argument: (stats.skipped_integer_argument ?? 0) - removedSkippedIntegerArgument,
            cases: records.filter((record) => !removedIndices.has(record.index)),
        },
        removed,
        unbound: 0,
    };
}
