/** 双 target 矩阵共用的绿门禁。`legion test` 的 status 只作诊断，不参与判定。 */
export type MatrixGreenFlags = {
    buildStatus: number;
    manifestFresh: boolean;
    runtimeOk: boolean;
    testCaseTotal: number;
    executed_pass: number;
    executed_fail: number;
    blocked: number;
    not_run: number;
    /** 没有可执行期望的用例数：只作展示，不能抵扣真实执行计数。 */
    skipped?: number;
};

/**
 * 绿：能编、manifest 新鲜且 `<slug>.cases.ts` 全量真实执行通过。
 *
 * 不使用 `legion test` 的 status：项目没有 `test/` 目录时它同样返回 0，
 * 用 status 当绿判据会让“没跑”也变绿。`skipped` 是未执行用例，不能计入通过数。
 */
export function isMatrixRowGreen(row: MatrixGreenFlags): boolean {
    return row.buildStatus === 0
        && row.manifestFresh
        && row.runtimeOk
        && row.testCaseTotal > 0
        && row.executed_pass === row.testCaseTotal
        && row.executed_fail === 0
        && row.blocked === 0
        && row.not_run === 0;
}
