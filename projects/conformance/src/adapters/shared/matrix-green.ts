/** 双 target 矩阵共用的四门绿门禁。 */
export type MatrixGreenFlags = {
    buildStatus: number;
    testStatus: number;
    manifestFresh: boolean;
    runtimeOk: boolean;
    testCaseTotal: number;
    testCasePass: number;
    testCaseFail: number;
};

/** 绿：能编、`legion test` 通过、manifest 新鲜且 `metadata.tests` 全量通过。 */
export function isMatrixRowGreen(row: MatrixGreenFlags): boolean {
    return row.buildStatus === 0
        && row.testStatus === 0
        && row.manifestFresh
        && row.runtimeOk
        && row.testCaseTotal > 0
        && row.testCasePass === row.testCaseTotal
        && row.testCaseFail === 0;
}
