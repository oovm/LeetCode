/** 双 target 矩阵共用的四门绿门禁。 */
export type MatrixGreenFlags = {
    buildStatus: number;
    testStatus: number;
    manifestFresh: boolean;
    runtimeOk: boolean;
    testCaseTotal: number;
    executed_pass: number;
    executed_fail: number;
    blocked: number;
    not_run: number;
};

/** 绿：能编、`legion test` 通过、manifest 新鲜且 `metadata.tests` 全量真实执行通过。 */
export function isMatrixRowGreen(row: MatrixGreenFlags): boolean {
    return row.buildStatus === 0
        && row.testStatus === 0
        && row.manifestFresh
        && row.runtimeOk
        && row.testCaseTotal > 0
        && row.executed_pass === row.testCaseTotal
        && row.executed_fail === 0
        && row.blocked === 0
        && row.not_run === 0;
}
