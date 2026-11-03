/** `run_*_solver` 在 stdout 末行写出的结构化用例结果前缀。 */
export const SOLVER_RESULT_MARKER = 'VALKYRIE_SOLVER_RESULT ';

/** 用例结果四分类；四者之和恒等于 `testCaseTotal`。 */
export type SolverCaseStats = {
    ok: boolean;
    testCaseTotal: number;
    executed_pass: number;
    executed_fail: number;
    /** 因 ABI/glue/export 等基础设施原因无法执行，不计入失败。 */
    blocked: number;
    /** 因更早用例中止而从未执行，不是失败。 */
    not_run: number;
    firstFailureIndex: number | null;
    firstFailure: string | null;
};

export function emptySolverCaseStats(error: string | null = null): SolverCaseStats {
    return {
        ok: false,
        testCaseTotal: 0,
        executed_pass: 0,
        executed_fail: 0,
        blocked: 0,
        not_run: 0,
        firstFailureIndex: null,
        firstFailure: error,
    };
}

/**
 * 基础设施阻断消息：ABI bridge 缺失、export 缺失、glue 接口缺失等。
 * 命中时用例没有真正执行，必须记 `blocked`，不得算作 `executed_fail`。
 */
const BLOCKED_MESSAGE_PATTERNS: readonly RegExp[] = [
    /Cannot marshal/,
    /Cannot demarshal/,
    /no ABI bridge implemented/,
    /找不到 metadata\.invoke 对应的 export/,
    /ABI schema 里找不到 export/,
    /node glue 未暴露/,
    /napi 绑定不可用/,
];

export function isBlockedSolverMessage(message: string): boolean {
    return BLOCKED_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
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
                || typeof payload.executed_pass !== 'number'
                || typeof payload.executed_fail !== 'number'
                || typeof payload.blocked !== 'number'
                || typeof payload.not_run !== 'number'
            ) {
                return null;
            }
            return {
                ok: payload.ok,
                testCaseTotal: payload.testCaseTotal,
                executed_pass: payload.executed_pass,
                executed_fail: payload.executed_fail,
                blocked: payload.blocked,
                not_run: payload.not_run,
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
