import type { ObservationPhase } from '../../observation/guest-trap.ts';

/** `run_*_solver` 在 stdout 末行写出的结构化用例结果前缀。 */
export const SOLVER_RESULT_MARKER = 'VALKYRIE_SOLVER_RESULT ';

/**
 * 逐例结果记录（验收观察门）。
 *
 * 每条记录携带稳定 case identity 与内容摘要；隔离统计只消费记录中的真实逐例状态，
 * 禁止从汇总计数倒推。`not_run` / `blocked` 逐例显式落账，不靠区间推断。
 */
export type CaseRecordStatus = 'pass' | 'fail' | 'blocked' | 'not_run' | 'skipped';

export type CaseRecord = {
    /** `metadata.tests` 下标（原始坐标，非可执行子集位置）。 */
    index: number;
    /** 稳定身份：`<slug>::tests[<index>]`。 */
    caseId: string;
    /** 用例内容（`args` + `expected`）的 sha256 摘要。 */
    digest: string;
    status: CaseRecordStatus;
    /** `skipped` 的细分原因。 */
    skipped_reason?: 'timeout' | 'integer-argument';
    /** 宿主侧观测阶段（wasm lane 才有）。 */
    phase?: ObservationPhase;
    /** 明确 guest trap 身份（类型 + 原因）。 */
    guest_trap?: { kind: string; reason: string };
    /** 失败/阻塞/未运行的首行原因。 */
    message?: string;
};

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
    /** `skipped` 中因 `corpusDefect` 标注排除的条数（TS 用例模块）。 */
    skipped_corpus_defect?: number;
    /** 判题用例来源：`<slug>.cases.ts` 优先，`metadata.json` 回退。 */
    casesSource?: string;
    firstFailureIndex: number | null;
    firstFailure: string | null;
    /** 逐例真实观测；缺失表示旧格式行，隔离统计不得倒推。 */
    cases?: CaseRecord[];
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

const CASE_RECORD_STATUSES: readonly CaseRecordStatus[] = ['pass', 'fail', 'blocked', 'not_run', 'skipped'];

/** 逐例记录形状校验；`undefined` 表示旧格式无记录，坏形状返回 `null` fail-closed。 */
function parseCaseRecords(raw: unknown): CaseRecord[] | null | undefined {
    if (raw === undefined || raw === null) {
        return undefined;
    }
    if (!Array.isArray(raw)) {
        return null;
    }
    const records: CaseRecord[] = [];
    for (const item of raw) {
        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
            return null;
        }
        const record = item as Record<string, unknown>;
        if (
            typeof record.index !== 'number'
                || !Number.isInteger(record.index)
                || record.index < 0
                || typeof record.caseId !== 'string'
                || typeof record.digest !== 'string'
                || !/^[0-9a-f]{64}$/.test(record.digest)
                || !CASE_RECORD_STATUSES.includes(record.status as CaseRecordStatus)
        ) {
            return null;
        }
        const parsed: CaseRecord = {
            index: record.index,
            caseId: record.caseId,
            digest: record.digest,
            status: record.status as CaseRecordStatus,
        };
        if (record.skipped_reason === 'timeout' || record.skipped_reason === 'integer-argument') {
            parsed.skipped_reason = record.skipped_reason;
        }
        if (record.phase === 'marshal' || record.phase === 'guest-invoke' || record.phase === 'demarshal-normalize') {
            parsed.phase = record.phase;
        }
        if (
            typeof record.guest_trap === 'object'
                && record.guest_trap !== null
                && typeof (record.guest_trap as Record<string, unknown>).kind === 'string'
                && typeof (record.guest_trap as Record<string, unknown>).reason === 'string'
        ) {
            parsed.guest_trap = {
                kind: (record.guest_trap as Record<string, string>).kind,
                reason: (record.guest_trap as Record<string, string>).reason,
            };
        }
        if (typeof record.message === 'string') {
            parsed.message = record.message;
        }
        records.push(parsed);
    }
    return records;
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
            const cases = parseCaseRecords((payload as { cases?: unknown }).cases);
            if (cases === null) {
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
                ...(typeof payload.skipped_corpus_defect === 'number' ? { skipped_corpus_defect: payload.skipped_corpus_defect } : {}),
                ...(typeof payload.casesSource === 'string' ? { casesSource: payload.casesSource } : {}),
                firstFailureIndex: payload.firstFailureIndex ?? null,
                firstFailure: payload.firstFailure ?? null,
                ...(cases === undefined || cases === null ? {} : { cases }),
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
