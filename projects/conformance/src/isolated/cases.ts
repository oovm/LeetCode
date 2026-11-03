/**
 * TS 用例模块（`<slug>.cases.ts`）的类型与校验。
 *
 * 口径：
 * - 每题用例是强类型只读数组 `ProblemCases`，由判题器直接 import，不经 `JSON.parse`。
 * - 超安全整数一律以 `bigint` 字面量承载（`123n`），转换器从 JSON 原文逐字提取，不丢精度。
 * - 整数值越过安全界却用 `number` 承载的用例在装载时判 `unsafe_number` 结构化失败，
 *   不静默降级（该值在 JSON 原文里若已浮点化/截断，属于 `corpusDefect`，见下）。
 * - `corpusDefect` 条目保留原值、显式标注、不作为可执行用例；能从原文逐字保真恢复的
 *   条目由转换器恢复为可执行用例并移除标注（当前全库无此类存量，规则留给转换器与校验器执行）。
 */

/** 语料缺陷标注：原值保留在 `args`/`expected` 中，不参与判题。 */
export type CorpusDefect = {
    /** 缺陷类别，如 `float_literal`（原文已浮点化，无法恢复整数值）。 */
    kind: string;
    /** 缺陷依据与新值来源说明（为什么无法保真恢复）。 */
    reason: string;
};

/** 单条判题用例。 */
export type ProblemCase = {
    args: Record<string, unknown>;
    expected: unknown;
    corpusDefect?: CorpusDefect;
};

/** 题目用例模块的导出形态。 */
export type ProblemCases = readonly ProblemCase[];

export type CasesValidation =
    | { ok: true; cases: ProblemCases }
    | { ok: false; failureKind: 'cases_missing' | 'cases_schema' | 'unsafe_number'; message: string };

const MAX_SAFE = 9007199254740991;

function walkValues(value: unknown, path: string, visit: (leaf: unknown, leafPath: string) => string | null): string | null {
    if (Array.isArray(value)) {
        for (const [index, item] of value.entries()) {
            const hit = walkValues(item, `${path}[${index}]`, visit);
            if (hit !== null) {
                return hit;
            }
        }
        return null;
    }
    if (typeof value === 'object' && value !== null) {
        for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
            const hit = walkValues(item, `${path}.${key}`, visit);
            if (hit !== null) {
                return hit;
            }
        }
        return null;
    }
    return visit(value, path);
}

function rejectUnsafeNumber(value: unknown, path: string): string | null {
    if (typeof value === 'number' && Number.isInteger(value) && Math.abs(value) > MAX_SAFE) {
        return `${path}: 整数值 ${value} 越过 Number.MAX_SAFE_INTEGER 却以 number 承载；改用 bigint 字面量（精确十进制 + n 后缀）`;
    }
    return null;
}

/**
 * 校验用例模块导出的形状与数值保真。
 * `cases` 为 `undefined`/非数组/空数组 → `cases_missing`；条目缺 `args`/`expected` → `cases_schema`；
 * 任何整数值超安全界的 `number` → `unsafe_number`。
 */
export function validateCasesModule(cases: unknown, source: string): CasesValidation {
    if (!Array.isArray(cases) || cases.length === 0) {
        return { ok: false, failureKind: 'cases_missing', message: `${source}: 用例数组缺失或为空` };
    }
    for (const [index, entry] of (cases as unknown[]).entries()) {
        if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
            return { ok: false, failureKind: 'cases_schema', message: `${source}: cases[${index}] 不是对象` };
        }
        const record = entry as Record<string, unknown>;
        if (typeof record.args !== 'object' || record.args === null || Array.isArray(record.args)) {
            return { ok: false, failureKind: 'cases_schema', message: `${source}: cases[${index}].args 必须是对象` };
        }
        if (!('expected' in record)) {
            return { ok: false, failureKind: 'cases_schema', message: `${source}: cases[${index}].expected 缺失` };
        }
        if ('corpusDefect' in record) {
            const defect = record.corpusDefect;
            if (typeof defect !== 'object' || defect === null || typeof (defect as CorpusDefect).kind !== 'string') {
                return { ok: false, failureKind: 'cases_schema', message: `${source}: cases[${index}].corpusDefect 需要 { kind, reason }` };
            }
            // 缺陷条目原值保留作证据、永不执行：跳过数值保真守卫（其原值可能正是已浮点化的损失形态）。
            continue;
        }
        const unsafeInArgs = walkValues(record.args, `cases[${index}].args`, rejectUnsafeNumber);
        if (unsafeInArgs !== null) {
            return { ok: false, failureKind: 'unsafe_number', message: `${source}: ${unsafeInArgs}` };
        }
        const unsafeInExpected = walkValues(record.expected, `cases[${index}].expected`, rejectUnsafeNumber);
        if (unsafeInExpected !== null) {
            return { ok: false, failureKind: 'unsafe_number', message: `${source}: ${unsafeInExpected}` };
        }
    }
    return { ok: true, cases: cases as ProblemCases };
}

export type PartitionedCases = {
    /** 可执行用例（保真）。 */
    executable: ProblemCase[];
    /** 被 `corpusDefect` 标注排除的用例（原值保留，不计入 pass/fail 分母）。 */
    defect: ProblemCase[];
};

/** 把用例分为可执行与缺陷两组；缺陷用例显式排除，不静默跳过。 */
export function partitionCases(cases: ProblemCases): PartitionedCases {
    const executable: ProblemCase[] = [];
    const defect: ProblemCase[] = [];
    for (const entry of cases) {
        if (entry.corpusDefect) {
            defect.push(entry);
        } else {
            executable.push(entry);
        }
    }
    return { executable, defect };
}
