import { compareIntegerResult, integerResultText, isUnsafeIntegerLiteralString } from './integer-literal.ts';

/** `void` 解返回 `undefined`；metadata 用 `null` 表示无返回值断言。 */
export function normalizeTsTestResult(value: unknown): unknown {
    return value === undefined ? null : value;
}

/** 实际值内是否出现 `bigint`（数组递归）。出现即不能用 `JSON.stringify` 比较。 */
function containsBigint(value: unknown): boolean {
    if (typeof value === 'bigint') {
        return true;
    }
    if (Array.isArray(value)) {
        return value.some(containsBigint);
    }
    return false;
}

/**
 * 含 `bigint` 的实际值与期望值的深比较：整数叶子（`bigint` / 整数数值 / 十进制字符串）
 * 一律规整为精确十进制文本再比较，非整数叶子退回结构比较。
 * 仅在实际值含 `bigint` 时启用，避免把真实字符串期望（如 `"3"`）与数值误判相等。
 */
function compareWithBigint(actual: unknown, expected: unknown): boolean {
    const actualText = integerResultText(actual);
    const expectedText = integerResultText(expected);
    if (actualText !== null && expectedText !== null) {
        return actualText === expectedText;
    }
    if (Array.isArray(actual) && Array.isArray(expected)) {
        return actual.length === expected.length && actual.every((item, index) => compareWithBigint(item, expected[index]));
    }
    return JSON.stringify(actual) === JSON.stringify(expected);
}

/** metadata 中 `expected: "Error: ..."` 表示应抛出异常且消息匹配。 */
export function assertTestCase(index: number, expected: unknown, run: () => unknown): void {
    if (typeof expected === 'string' && expected.startsWith('Error:')) {
        try {
            run();
        } catch (err) {
            const actual = err instanceof Error ? `Error: ${err.message}` : `Error: ${String(err)}`;
            if (actual !== expected) {
                throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
            }
            return;
        }
        throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, no exception raised`);
    }
    const actual = normalizeTsTestResult(run());
    const normalized = normalizeTsTestResult(expected);
    // 整数新表示：expected 为超安全整数的十进制字符串且 actual 为数值/bigint 时按十进制文本比较，
    // 避免 `"72057594037927940"`（精确字符串）与对应数值因类型不同而误判失败。
    // 只认超安全整数（生成器侧只转换这类），actual 为字符串（如 `"Fizz"`）时走下方结构比较。
    if (isUnsafeIntegerLiteralString(normalized) && (typeof actual === 'number' || typeof actual === 'bigint')) {
        const cmp = compareIntegerResult(actual, normalized);
        if (cmp === true) {
            return;
        }
        if (cmp === false) {
            throw new Error(`tests[${index}]: expected ${JSON.stringify(normalized)}, got ${String(actual)}`);
        }
    }
    // `bigint` 实际值（大整数解经 `BigInt` 通道返回）按精确十进制文本深比较，
    // 覆盖安全整数裸数值期望与超安全整数字符串期望两种形态。
    if (containsBigint(actual)) {
        if (compareWithBigint(actual, normalized)) {
            return;
        }
        throw new Error(`tests[${index}]: expected ${JSON.stringify(normalized)}, got ${String(actual)}`);
    }
    if (JSON.stringify(actual) !== JSON.stringify(normalized)) {
        throw new Error(`tests[${index}]: expected ${JSON.stringify(normalized)}, got ${JSON.stringify(actual)}`);
    }
}

/**
 * 异步调用方的错误断言：`run` 返回 Promise 时，同步 `assertTestCase` 的 `try/catch`
 * 观察不到 rejection，期望抛错的用例会被误判成“未抛错”。这里先 `await` 再比较异常消息。
 */
export async function assertRejectsTestCase(index: number, expected: string, run: () => Promise<unknown>): Promise<void> {
    try {
        await run();
    } catch (err) {
        const actual = err instanceof Error ? `Error: ${err.message}` : `Error: ${String(err)}`;
        if (actual !== expected) {
            throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
        }
        return;
    }
    throw new Error(`tests[${index}]: expected ${JSON.stringify(expected)}, no exception raised`);
}
