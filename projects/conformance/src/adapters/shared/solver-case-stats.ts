/** `run_*_solver` 在 stdout 末行写出的结构化用例结果前缀。 */
export const SOLVER_RESULT_MARKER = 'VALKYRIE_SOLVER_RESULT ';

/**
 * 用例结果四分类；`executed_pass + executed_fail + blocked + not_run === testCaseTotal - skipped`。
 *
 * `skipped` 是「没有可执行期望」的语料：`Execution timed out` 哨兵，以及整数 ABI 送不进去的
 * 非整数实参。它们不进 pass/fail 分母，单独计数，不能悄悄变成通过率的一部分。
 */
export type SolverCaseStats = {
    ok: boolean;
    testCaseTotal: number;
    executed_pass: number;
    executed_fail: number;
    /** 因 ABI/glue/export 等基础设施原因无法执行，不计入失败。 */
    blocked: number;
    /** 因更早用例中止而从未执行，不是失败。 */
    not_run: number;
    /** 没有可执行期望、已从 pass/fail 分母排除的用例数。 */
    skipped?: number;
    /** `skipped` 中因 `Execution timed out` 哨兵（没有可执行期望）的条数。 */
    skipped_timeout?: number;
    /** `skipped` 中因整数 ABI 无法承载非整数实参的条数。 */
    skipped_integer_argument?: number;
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
        skipped: 0,
        skipped_timeout: 0,
        skipped_integer_argument: 0,
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
                skipped: typeof payload.skipped === 'number' ? payload.skipped : 0,
                skipped_timeout: typeof payload.skipped_timeout === 'number' ? payload.skipped_timeout : 0,
                skipped_integer_argument: typeof payload.skipped_integer_argument === 'number'
                    ? payload.skipped_integer_argument
                    : 0,
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

/** 行级三态：绿 = 全部用例真实通过；红 = 真实失败；未验证 = 仍有用例未执行。 */
export type MatrixRowOutcome = 'green' | 'red' | 'unverified';

/** 未验证的原因码：`skipped` 的细分与 `blocked` / `not_run` 分开列出。 */
export type MatrixUnverifiedReason =
    | 'timeout'
    | 'integer-abi'
    | 'unspecified-skip'
    | 'infrastructure'
    | 'not-run';

/** 三态判定所需的行级证据；与 lane 行类型结构兼容。 */
export type MatrixOutcomeFlags = {
    green: boolean;
    buildStatus: number;
    manifestFresh: boolean;
    testCaseTotal: number;
    executed_pass: number;
    executed_fail: number;
    blocked: number;
    not_run: number;
    skipped?: number;
    skipped_timeout?: number;
    skipped_integer_argument?: number;
};

/**
 * 按三态归类一行。
 *
 * build / manifest 失败没有可验证对象，是真实的红。真实断言失败优先于未验证。
 * 只有构建、manifest 正常且没有断言失败、却仍有未执行用例（`skipped` / `blocked` / `not_run`）时，
 * 才是「未验证」：它不计入失败数，但也不能算绿。
 */
export function classifyMatrixOutcome(row: MatrixOutcomeFlags): MatrixRowOutcome {
    if (row.green) {
        return 'green';
    }
    if (row.buildStatus !== 0 || !row.manifestFresh) {
        return 'red';
    }
    if (row.executed_fail > 0) {
        return 'red';
    }
    const unexecuted = (row.skipped ?? 0) + row.blocked + row.not_run;
    if (row.testCaseTotal > 0 && unexecuted > 0) {
        return 'unverified';
    }
    return 'red';
}

/** 未验证行的原因清单；非未验证行返回空数组。 */
export function collectUnverifiedReasons(row: MatrixOutcomeFlags): MatrixUnverifiedReason[] {
    if (classifyMatrixOutcome(row) !== 'unverified') {
        return [];
    }
    const reasons: MatrixUnverifiedReason[] = [];
    if ((row.skipped_timeout ?? 0) > 0) {
        reasons.push('timeout');
    }
    if ((row.skipped_integer_argument ?? 0) > 0) {
        reasons.push('integer-abi');
    }
    const unattributedSkip = (row.skipped ?? 0) - (row.skipped_timeout ?? 0) - (row.skipped_integer_argument ?? 0);
    if (unattributedSkip > 0) {
        reasons.push('unspecified-skip');
    }
    if (row.blocked > 0) {
        reasons.push('infrastructure');
    }
    if (row.not_run > 0) {
        reasons.push('not-run');
    }
    return reasons;
}
