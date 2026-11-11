/**
 * `run_*_solver` 子进程的逐例记录构造（验收观察门）。
 *
 * 每条记录携带稳定 case identity（`<slug>::tests[<index>]`）与内容摘要；
 * `not_run` / `blocked` 逐例显式落账，隔离统计因此永远不需要从汇总计数倒推。
 */
import type { CaseRecord, CaseRecordStatus } from '../adapters/shared/solver-case-stats.ts';
import { solverCaseDigest, solverCaseId } from './case-identity.ts';
import { classifyThrown } from './guest-trap.ts';

/** 逐例记录：稳定身份 + 内容摘要 + 本例真实观测状态。 */
export function makeRecord(
    slug: string,
    index: number,
    testCase: { args: unknown; expected: unknown },
    status: CaseRecordStatus,
    extra: Partial<CaseRecord> = {},
): CaseRecord {
    return {
        index,
        caseId: solverCaseId(slug, index),
        digest: solverCaseDigest(testCase.args, testCase.expected),
        status,
        ...extra,
    };
}

/** 从抛错提取观测阶段与 guest trap 身份；宿主侧异常不会伪造 guest trap。 */
export function failureObservation(err: unknown): Partial<CaseRecord> {
    const classified = classifyThrown(err, 'guest-invoke');
    if (classified.kind === 'guest-trap') {
        return { phase: 'guest-invoke', guest_trap: { kind: classified.trapKind, reason: classified.reason } };
    }
    return { phase: classified.phase };
}

/** 把尚未落账的可执行用例按 `not_run` / `blocked` 逐例显式补齐，不靠区间倒推。 */
export function fillRemainingRecords(
    records: CaseRecord[],
    slug: string,
    executableCases: readonly { testCase: { args: unknown; expected: unknown }; index: number }[],
    status: CaseRecordStatus,
    message: string | undefined,
): void {
    const accounted = new Set(records.map((record) => record.index));
    for (const { testCase, index } of executableCases) {
        if (accounted.has(index)) {
            continue;
        }
        records.push(makeRecord(slug, index, testCase, status, message === undefined ? {} : { message }));
    }
}
