import { isUnsafeIntegerLiteralString } from './integer-literal.ts';

/** 值内是否出现裸 `number` / `bigint`（数组递归）。生成器对整数型实参在不超过安全整数时写裸数值。 */
export function hasBareNumber(value: unknown): boolean {
    if (typeof value === 'number' || typeof value === 'bigint') {
        return true;
    }
    if (Array.isArray(value)) {
        return value.some(hasBareNumber);
    }
    return false;
}

/**
 * 按本题的 `metadata.tests` 推断各实参键的类型：任一同键出现裸数值即判定整数型，
 * 仅对整数型键规整超安全整数字符串；字符串型键（如 `add-binary` 的二进制串，
 * 词法上与超安全整数十进制串无法区分）一律原样保留，不误判为大整数。
 */
export function inferIntegerArgKeys(tests: ReadonlyArray<{ args: Record<string, unknown> }>): ReadonlySet<string> {
    const keys = new Set<string>();
    for (const case_ of tests) {
        for (const [key, value] of Object.entries(case_.args)) {
            if (hasBareNumber(value)) {
                keys.add(key);
            }
        }
    }
    return keys;
}

/**
 * 整数型实参的规整：超安全整数的十进制字符串解析为 `BigInt`（精确十进制还原），
 * 禁止 `Number(...)` 先行转 float 丢失低位；安全整数裸数值原样保留。
 * 只规整超安全整数的字符串整数，形如 `"11101110111"` 的真实字符串参数原样保留。
 */
export function coerceIntegerArgValue(value: unknown): unknown {
    if (isUnsafeIntegerLiteralString(value)) {
        return BigInt(value);
    }
    if (Array.isArray(value)) {
        return value.map(coerceIntegerArgValue);
    }
    return value;
}

/** 按推断出的整数型键逐键规整实参。 */
export function coerceIntegerArgs(args: Record<string, unknown>, integerKeys: ReadonlySet<string>): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(args).map(([key, value]) => [key, integerKeys.has(key) ? coerceIntegerArgValue(value) : value]),
    );
}
