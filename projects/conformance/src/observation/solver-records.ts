/**
 * `run_*_solver` 子进程的逐例记录构造（验收观察门）。
 *
 * 每条记录直接取自装载快照的冻结条目（`sourceIndex`/`caseId`/`digest`），
 * 不按可执行视图位置重新编号；`corpusDefect` 条目逐例落 `skipped`（原因
 * `corpus-defect`）并携带排除依据，形成明确的 excluded observation。
 * `not_run` / `blocked` 逐例显式落账，汇总计数一律由完整记录机械聚合，
 * 隔离统计因此永远不需要从汇总计数倒推。
 */
import type { CaseRecord, CaseRecordStatus, SolverCaseStats } from '../adapters/shared/solver-case-stats.ts';
import type { CaseSnapshotEntry } from '../domain/cases-loader.ts';
import { classifyThrown } from './guest-trap.ts';

/** 逐例记录：冻结快照身份（sourceIndex/caseId/digest）+ 本例真实观测状态。 */
export function makeEntryRecord(entry: CaseSnapshotEntry, status: CaseRecordStatus, extra: Partial<CaseRecord> = {}): CaseRecord {
    return {
        index: entry.sourceIndex,
        caseId: entry.caseId,
        digest: entry.digest,
        status,
        ...extra,
    };
}

/** `corpusDefect` 条目的 excluded observation：逐例记录携带排除依据。 */
export function makeExcludedRecord(entry: CaseSnapshotEntry): CaseRecord {
    if (entry.exclusion === null) {
        throw new Error(`条目 ${entry.caseId} 无排除依据，不能落 excluded observation`);
    }
    return makeEntryRecord(entry, 'skipped', { skipped_reason: 'corpus-defect', exclusion: { ...entry.exclusion } });
}

/** 从抛错提取观测阶段与 guest trap 身份；宿主侧异常不会伪造 guest trap。 */
export function failureObservation(err: unknown): Partial<CaseRecord> {
    const classified = classifyThrown(err, 'guest-invoke');
    if (classified.kind === 'guest-trap') {
        return { phase: 'guest-invoke', guest_trap: { kind: classified.trapKind, reason: classified.reason } };
    }
    return { phase: classified.phase };
}

/** 把尚未落账的可执行条目按 `not_run` / `blocked` 逐例显式补齐，不靠区间倒推。 */
export function fillRemainingEntryRecords(
    records: CaseRecord[],
    executableEntries: readonly CaseSnapshotEntry[],
    status: CaseRecordStatus,
    message: string | undefined,
): void {
    const accounted = new Set(records.map((record) => record.index));
    for (const entry of executableEntries) {
        if (accounted.has(entry.sourceIndex)) {
            continue;
        }
        records.push(makeEntryRecord(entry, status, message === undefined ? {} : { message }));
    }
}

export type AggregateExtras = {
    casesSource?: string;
    casesDigest?: string;
    firstFailureIndex: number | null;
    firstFailure: string | null;
};

/**
 * 由完整逐例记录机械聚合汇总计数（禁止手算加回）。
 * 不变量：`executed_pass + executed_fail + blocked + not_run === testCaseTotal - skipped`。
 */
export function aggregateCaseStats(records: readonly CaseRecord[], extras: AggregateExtras): SolverCaseStats {
    const sorted = [...records].sort((left, right) => left.index - right.index);
    const count = (status: CaseRecordStatus) => sorted.filter((record) => record.status === status).length;
    const countSkipped = (reason: NonNullable<CaseRecord['skipped_reason']>) =>
        sorted.filter((record) => record.status === 'skipped' && record.skipped_reason === reason).length;
    const executedFail = count('fail');
    const blocked = count('blocked');
    const notRun = count('not_run');
    const skippedTimeout = countSkipped('timeout');
    const skippedIntegerArgument = countSkipped('integer-argument');
    const skippedCorpusDefect = countSkipped('corpus-defect');
    return {
        ok: executedFail === 0 && blocked === 0 && notRun === 0,
        testCaseTotal: sorted.length,
        executed_pass: count('pass'),
        executed_fail: executedFail,
        blocked,
        not_run: notRun,
        skipped: skippedTimeout + skippedIntegerArgument + skippedCorpusDefect,
        skipped_timeout: skippedTimeout,
        skipped_integer_argument: skippedIntegerArgument,
        skipped_corpus_defect: skippedCorpusDefect,
        ...(extras.casesSource === undefined ? {} : { casesSource: extras.casesSource }),
        ...(extras.casesDigest === undefined ? {} : { casesDigest: extras.casesDigest }),
        firstFailureIndex: extras.firstFailureIndex,
        firstFailure: extras.firstFailure,
        cases: sorted,
    };
}
