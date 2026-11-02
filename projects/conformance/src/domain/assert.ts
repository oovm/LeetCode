import { compareIntegerResult, isUnsafeIntegerLiteralString } from './integer-literal.ts';

/** `void` 解返回 `undefined`；metadata 用 `null` 表示无返回值断言。 */
export function normalizeTsTestResult(value: unknown): unknown {
    return value === undefined ? null : value;
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
            throw new Error(`tests[${index}]: expected ${JSON.stringify(normalized)}, got ${JSON.stringify(actual)}`);
        }
    }
    if (JSON.stringify(actual) !== JSON.stringify(normalized)) {
        throw new Error(`tests[${index}]: expected ${JSON.stringify(normalized)}, got ${JSON.stringify(actual)}`);
    }
}
