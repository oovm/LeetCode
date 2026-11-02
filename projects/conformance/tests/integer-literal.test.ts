import { describe, expect, it } from 'vitest';

import { assertTestCase } from '../src/domain/assert.ts';
import { coerceIntegerArgs, hasBareNumber, inferIntegerArgKeys } from '../src/domain/integer-args.ts';
import {
    coerceIntegerArgument,
    compareIntegerResult,
    I64_MAX,
    I64_MIN,
    integerResultText,
    isUnsafeIntegerLiteralString,
    parseIntegerLiteral,
    U64_MAX,
    U64_MIN,
} from '../src/domain/integer-literal.ts';

// 精度边界：`2^53-1` 是 double 最大安全整数，`2^53` 起整数必须以十进制字符串表示，
// `2^64-1` 是 u64 上限；负数下限到 `-2^63`；前导零文本按十进制原文解析。
const SAFE_MAX = '9007199254740991'; // 2^53 - 1
const SAFE_MAX_PLUS_ONE = '9007199254740992'; // 2^53
const U64_MAX_TEXT = '18446744073709551615'; // 2^64 - 1
const I64_MAX_TEXT = '9223372036854775807'; // 2^63 - 1
const I64_MIN_TEXT = '-9223372036854775808'; // -2^63

describe('integer literal parsing boundaries', () => {
    it('parses 2^53-1 / 2^53 / 2^64-1 / negatives exactly', () => {
        expect(parseIntegerLiteral(SAFE_MAX)).toBe((1n << 53n) - 1n);
        expect(parseIntegerLiteral(SAFE_MAX_PLUS_ONE)).toBe(1n << 53n);
        expect(parseIntegerLiteral(U64_MAX_TEXT)).toBe((1n << 64n) - 1n);
        expect(parseIntegerLiteral(I64_MIN_TEXT)).toBe(-(1n << 63n));
    });

    it('parses leading-zero decimal text without loss', () => {
        expect(parseIntegerLiteral('007')).toBe(7n);
        expect(parseIntegerLiteral('-000123')).toBe(-123n);
        expect(parseIntegerLiteral('000')).toBe(0n);
        expect(isUnsafeIntegerLiteralString('09007199254740992')).toBe(true);
    });

    it('rejects non-literals without silent truncation', () => {
        expect(parseIntegerLiteral('1.5')).toBeNull();
        expect(parseIntegerLiteral('1e25')).toBeNull();
        expect(parseIntegerLiteral('12abc')).toBeNull();
        expect(parseIntegerLiteral('')).toBeNull();
    });

    it('classifies unsafe strings only beyond 2^53-1', () => {
        expect(isUnsafeIntegerLiteralString(SAFE_MAX)).toBe(false);
        expect(isUnsafeIntegerLiteralString(SAFE_MAX_PLUS_ONE)).toBe(true);
        expect(isUnsafeIntegerLiteralString('-9007199254740992')).toBe(true);
        // 二进制串等真实字符串虽然词法像大整数，但只有超安全整数才被规整
        expect(isUnsafeIntegerLiteralString('111')).toBe(false);
    });
});

describe('integer argument coercion', () => {
    it('keeps i64 boundaries and rejects out-of-range text', () => {
        expect(coerceIntegerArgument(I64_MAX_TEXT, I64_MIN, I64_MAX, 'args.n')).toBe(I64_MAX_TEXT);
        expect(coerceIntegerArgument(I64_MIN_TEXT, I64_MIN, I64_MAX, 'args.n')).toBe(I64_MIN_TEXT);
        expect(() => coerceIntegerArgument(U64_MAX_TEXT, I64_MIN, I64_MAX, 'args.n')).toThrow(/超出/);
        expect(coerceIntegerArgument(U64_MAX_TEXT, U64_MIN, U64_MAX, 'args.n')).toBe(U64_MAX_TEXT);
    });

    it('normalizes numbers and bigints to shortest round-trip text', () => {
        expect(coerceIntegerArgument(42, I64_MIN, I64_MAX, 'args.n')).toBe('42');
        expect(coerceIntegerArgument((1n << 53n) + 1n, I64_MIN, I64_MAX, 'args.n')).toBe('9007199254740993');
        expect(() => coerceIntegerArgument(1.5, I64_MIN, I64_MAX, 'args.n')).toThrow(/非整数/);
    });

    it('passes through non-integer values untouched', () => {
        expect(coerceIntegerArgument('abc', I64_MIN, I64_MAX, 'args.s')).toBeNull();
        expect(coerceIntegerArgument(null, I64_MIN, I64_MAX, 'args.x')).toBeNull();
    });
});

describe('per-key integer inference and BigInt coercion', () => {
    const tests = [
        { args: { n: 6, s: '11101110111' } },
        { args: { n: SAFE_MAX_PLUS_ONE, s: '1010' } },
        { args: { n: [1, 2, U64_MAX_TEXT], s: '0' } },
    ];

    it('infers integer keys from bare numbers only', () => {
        expect(inferIntegerArgKeys(tests)).toEqual(new Set(['n']));
        expect(hasBareNumber(['a', ['b']])).toBe(false);
        expect(hasBareNumber([1n])).toBe(true);
    });

    it('coerces unsafe strings to BigInt and keeps string keys intact', () => {
        const coerced = coerceIntegerArgs(tests[2].args, inferIntegerArgKeys(tests));
        expect(coerced.n).toEqual([1, 2, (1n << 64n) - 1n]);
        expect(coerced.s).toBe('0');
        const first = coerceIntegerArgs(tests[1].args, inferIntegerArgKeys(tests));
        expect(first.n).toBe(1n << 53n);
        expect(first.s).toBe('1010');
    });
});

describe('integer result comparison', () => {
    it('compares decimal text across number, bigint and string forms', () => {
        expect(compareIntegerResult(9007199254740991n, SAFE_MAX)).toBe(true);
        expect(compareIntegerResult((1n << 64n) - 1n, U64_MAX_TEXT)).toBe(true);
        expect(compareIntegerResult(1n, SAFE_MAX)).toBe(false);
        expect(compareIntegerResult(1.5, '1.5')).toBeNull();
        expect(integerResultText('007')).toBe('7');
    });
});

describe('assertTestCase with BigInt results', () => {
    it('matches bigint actual against bare number and unsafe string expectations', () => {
        expect(() => assertTestCase(0, 6, () => 6n)).not.toThrow();
        expect(() => assertTestCase(1, U64_MAX_TEXT, () => (1n << 64n) - 1n)).not.toThrow();
        expect(() => assertTestCase(2, [1, SAFE_MAX_PLUS_ONE], () => [1n, 1n << 53n])).not.toThrow();
    });

    it('rejects mismatched bigint actuals with readable error', () => {
        expect(() => assertTestCase(3, '9007199254740993', () => 1n << 53n)).toThrow(/tests\[3\]/);
        expect(() => assertTestCase(4, [1, 2], () => [1n, 3n])).toThrow(/tests\[4\]/);
    });
});
