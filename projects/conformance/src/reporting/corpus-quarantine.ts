import { existsSync, readFileSync } from 'node:fs';

import type { SolverCaseStats } from '../adapters/shared/solver-case-stats.ts';

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
 * 清单是侧车 manifest：坐标只标识 `metadata.tests` 下标，不改 metadata、不改 expected。
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
 * 按坐标把隔离用例从四字段统计里扣掉。
 *
 * 归类重建规则（与 `run_*_solver` 的四字段合同一致）：`blocked` 行整行阻塞；`ok` 行整行通过；
 * 其余行 `firstFailureIndex` 之前为通过、该下标为失败、其后为未运行。
 * 越界下标（清单与当前 metadata 不一致）不计入，避免凭空减少用例。
 */
export function quarantineCaseStats(stats: SolverCaseStats, indices: ReadonlySet<number>): SolverCaseStats {
    const buckets: CaseBuckets = { executed_pass: 0, executed_fail: 0, blocked: 0, not_run: 0 };
    let removed = 0;
    for (const index of indices) {
        if (!Number.isInteger(index) || index < 0 || index >= stats.testCaseTotal) {
            continue;
        }
        removed += 1;
        buckets[classifyCase(stats, index)] += 1;
    }
    return {
        ...stats,
        testCaseTotal: stats.testCaseTotal - removed,
        executed_pass: stats.executed_pass - buckets.executed_pass,
        executed_fail: stats.executed_fail - buckets.executed_fail,
        blocked: stats.blocked - buckets.blocked,
        not_run: stats.not_run - buckets.not_run,
    };
}

function classifyCase(stats: SolverCaseStats, index: number): keyof CaseBuckets {
    if (stats.blocked > 0) {
        return 'blocked';
    }
    if (stats.ok) {
        return 'executed_pass';
    }
    const firstFailureIndex = stats.firstFailureIndex;
    if (firstFailureIndex === null) {
        return 'not_run';
    }
    if (index < firstFailureIndex) {
        return 'executed_pass';
    }
    if (index === firstFailureIndex) {
        return 'executed_fail';
    }
    return 'not_run';
}
