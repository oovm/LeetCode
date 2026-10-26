/** `run_*_solver` 在 stdout 末行写出的结构化用例结果前缀。 */
export const SOLVER_RESULT_MARKER = 'VALKYRIE_SOLVER_RESULT ';

export type SolverCaseStats = {
    ok: boolean;
    testCaseTotal: number;
    testCasePass: number;
    testCaseFail: number;
    firstFailureIndex: number | null;
    firstFailure: string | null;
};

export function emptySolverCaseStats(error: string | null = null): SolverCaseStats {
    return {
        ok: false,
        testCaseTotal: 0,
        testCasePass: 0,
        testCaseFail: 0,
        firstFailureIndex: null,
        firstFailure: error,
    };
}

export function formatSolverResultLine(stats: SolverCaseStats): string {
    return `${SOLVER_RESULT_MARKER}${JSON.stringify(stats)}`;
}

/** 从 solver 子进程输出中解析用例统计；缺失时返回 null。 */
export function parseSolverResultLine(text: string): SolverCaseStats | null {
    const lines = text.split(/\r?\n/);
    for (let index = lines.length - 1; index >= 0; index -= 1) {
        const line = lines[index].trim();
        if (!line.startsWith(SOLVER_RESULT_MARKER)) {
            continue;
        }
        try {
            const payload = JSON.parse(line.slice(SOLVER_RESULT_MARKER.length)) as SolverCaseStats;
            if (
                typeof payload.ok !== 'boolean'
                || typeof payload.testCaseTotal !== 'number'
                || typeof payload.testCasePass !== 'number'
                || typeof payload.testCaseFail !== 'number'
            ) {
                return null;
            }
            return {
                ok: payload.ok,
                testCaseTotal: payload.testCaseTotal,
                testCasePass: payload.testCasePass,
                testCaseFail: payload.testCaseFail,
                firstFailureIndex: payload.firstFailureIndex ?? null,
                firstFailure: payload.firstFailure ?? null,
            };
        } catch {
            return null;
        }
    }
    return null;
}

/** 从失败消息中提取 `tests[N]` 下标。 */
export function extractTestFailureIndex(message: string): number | null {
    const match = message.match(/tests\[(\d+)\]/);
    if (!match) {
        return null;
    }
    return Number(match[1]);
}
