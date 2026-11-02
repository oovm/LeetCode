/**
 * 十进制整数字面量（字符串形态）的解析、校验与比较工具。
 *
 * `metadata.json` 经 `JSON.parse` 后，绝对值超过 $2^{53}-1$ 的整数已丢失低位。
 * 生成器侧把超出 `Number.MAX_SAFE_INTEGER` 的整数与整数化浮点一律写成十进制字符串；
 * 本模块是消费侧的统一入口：按 ABI/形参的整数类型把字符串解析为精确十进制文本
 * （i64/u64），越界或格式非法时给出结构化原因，绝不静默截断。
 */

const INTEGER_LITERAL = /^-?\d+$/;

export const I64_MIN = -(1n << 63n);
export const I64_MAX = (1n << 63n) - 1n;
export const U64_MIN = 0n;
export const U64_MAX = (1n << 64n) - 1n;

const MAX_SAFE_BIGINT = 9007199254740991n;

/** 判断值是否为十进制整数字面量字符串（可带前导负号）。 */
export function isIntegerLiteralString(value: unknown): value is string {
    return typeof value === 'string' && INTEGER_LITERAL.test(value);
}

/**
 * 判断字符串整数是否超出 `Number.MAX_SAFE_INTEGER`。
 *
 * 生成器侧只把越过安全整数的整数写成字符串，因此「超安全整数的字符串整数」
 * 即被转换的那类数值。无 ABI 类型信息的消费端（TS / Python / ovm）用它区分
 * 大整数与形如 `"11101110111"` 的真实字符串参数：只有超安全整数的才按整数处理。
 */
export function isUnsafeIntegerLiteralString(value: unknown): value is string {
    if (!isIntegerLiteralString(value)) {
        return false;
    }
    const parsed = parseIntegerLiteral(value);
    if (parsed === null) {
        return false;
    }
    return parsed > MAX_SAFE_BIGINT || parsed < -MAX_SAFE_BIGINT;
}

/** 解析十进制整数字面量为 `bigint`；非法格式返回 `null`（不静默截断）。 */
export function parseIntegerLiteral(value: string): bigint | null {
    if (!INTEGER_LITERAL.test(value)) {
        return null;
    }
    try {
        return BigInt(value);
    } catch {
        return null;
    }
}

/**
 * 把一个整数实参规整为交给 glue / argv 的十进制文本。
 *
 * - `number` / `bigint`：`toString()` 取最短可往返文本（既有 `preserveI64Precision` 形态）。
 * - 字符串：必须是合法十进制整数字面量且落在 `[min, max]`，否则抛结构化错误。
 *
 * 返回 `null` 表示该值不是整数实参（交给调用方按原值处理）。
 */
export function coerceIntegerArgument(value: unknown, min: bigint, max: bigint, path: string): string | null {
    if (typeof value === 'number') {
        if (!Number.isInteger(value)) {
            throw new Error(`${path} 需要整数实参，实际为非整数数值 ${JSON.stringify(value)}`);
        }
        return value.toString();
    }
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (isIntegerLiteralString(value)) {
        const parsed = parseIntegerLiteral(value);
        if (parsed === null) {
            throw new Error(`${path} 的整数字面量无法按十进制解析: ${JSON.stringify(value)}`);
        }
        if (parsed < min || parsed > max) {
            throw new Error(`${path} 的整数字面量 ${parsed} 超出 [${min}, ${max}] 表示范围`);
        }
        return parsed.toString();
    }
    return null;
}

/**
 * 整数返回值比较口径：两侧都规整为十进制文本再比较。
 *
 * `expected` 可能是字符串字面量（精确）或数值（≤2^53 精确 / 更大值已损失）；
 * `actual` 可能是数值或 `bigint`。任一侧能规整为整数文本时按文本比较，
 * 否则返回 `null` 交给调用方按结构比较。
 */
export function compareIntegerResult(actual: unknown, expected: unknown): boolean | null {
    const actualText = integerResultText(actual);
    const expectedText = integerResultText(expected);
    if (actualText === null || expectedText === null) {
        return null;
    }
    return actualText === expectedText;
}

/** 把单个整数结果（数值 / bigint / 十进制字符串）规整为十进制文本；非整数形态返回 `null`。 */
export function integerResultText(value: unknown): string | null {
    if (typeof value === 'number') {
        return Number.isInteger(value) ? value.toString() : null;
    }
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (isIntegerLiteralString(value)) {
        const parsed = parseIntegerLiteral(value);
        return parsed === null ? null : parsed.toString();
    }
    return null;
}
