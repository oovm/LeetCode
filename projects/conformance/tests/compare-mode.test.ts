import { describe, expect, it } from 'vitest';

import { assertTestCase } from '../src/domain/assert.ts';
import {
    canonicalForm,
    compareModeFor,
    compareModeForExecution,
    requireCompareMode,
    resultsMatch,
} from '../src/domain/compare-mode.ts';

describe('多解比较模式', () => {
    it('strict 保持 JSON 精确相等，不忽略顺序', () => {
        expect(resultsMatch([2, 1], [1, 2], 'strict')).toBe(false);
        expect(resultsMatch([1, 2], [1, 2], 'strict')).toBe(true);
    });

    it('unordered-1d 只放宽顶层顺序', () => {
        expect(resultsMatch(['b', 'a'], ['a', 'b'], 'unordered-1d')).toBe(true);
        expect(resultsMatch([2, 1], [1, 2], 'unordered-1d')).toBe(true);
        // 内层结构不参与顶层排序，演示不同形状不会误判相等。
        expect(resultsMatch([[2, 1]], [[1, 2]], 'unordered-1d')).toBe(false);
    });

    it('unordered-2d 同时放宽内外层顺序', () => {
        expect(resultsMatch([[2], [1, 2], [], [1]], [[1], [2], [1, 2], []], 'unordered-2d')).toBe(true);
        expect(resultsMatch([[2, 1], [3]], [[1, 2], [4]], 'unordered-2d')).toBe(false);
    });

    it('outer-only 外层任意、内层顺序保持', () => {
        expect(resultsMatch([[1, 2], [3, 4]], [[3, 4], [1, 2]], 'outer-only')).toBe(true);
        expect(resultsMatch([[2, 1], [3, 4]], [[1, 2], [3, 4]], 'outer-only')).toBe(false);
    });

    it('nested-1d 外层结构固定、各内层分别排序', () => {
        expect(resultsMatch([[3, 4, 5], [2, 1]], [[5, 4, 3], [1, 2]], 'nested-1d')).toBe(true);
        expect(resultsMatch([[2, 1], [3, 4, 5]], [[5, 4, 3], [1, 2]], 'nested-1d')).toBe(false);
    });

    it('规范化比较保留超安全整数精确文本与 bigint 等价', () => {
        expect(resultsMatch([9007199254740993n], ['9007199254740993'], 'unordered-1d')).toBe(true);
        expect(resultsMatch([9007199254740993n, 1], [1, '9007199254740992'], 'unordered-1d')).toBe(false);
    });

    it('题面登记模式与预期一致', () => {
        expect(compareModeFor('lucky-numbers-in-a-matrix')).toBe('unordered-1d');
        expect(compareModeFor('two-out-of-three')).toBe('unordered-1d');
        expect(compareModeFor('subsets')).toBe('unordered-2d');
        expect(compareModeFor('n-queens')).toBe('outer-only');
        expect(compareModeFor('find-the-difference-of-two-arrays')).toBe('nested-1d');
        expect(compareModeFor('toeplitz-matrix')).toBe('strict');
        expect(requireCompareMode('gray-code')).toBe('validator-required');
    });

    it('多合法解题目必须命中语义校验器，缺失校验器时才拒绝', () => {
        expect(compareModeForExecution('gray-code')).toBe('validator-required');
        expect(compareModeForExecution('sort-array-by-parity')).toBe('validator-required');
        expect(() => resultsMatch([1], [1], 'validator-required')).toThrow(/题面语义校验/);
    });

    it('语义校验器按题面判定解是否合法', () => {
        const grayCodeArgs = { n: 2 };
        expect(resultsMatch([0, 1, 3, 2], [], 'validator-required', { problemId: 'gray-code', args: grayCodeArgs })).toBe(true);
        expect(resultsMatch([0, 1, 2, 3], [], 'validator-required', { problemId: 'gray-code', args: grayCodeArgs })).toBe(false);

        expect(
            resultsMatch([4, 2, 3, 1], [], 'validator-required', {
                problemId: 'sort-array-by-parity',
                args: { nums: [3, 4, 1, 2] },
            }),
        ).toBe(true);
        expect(
            resultsMatch([3, 4, 1, 2], [], 'validator-required', {
                problemId: 'sort-array-by-parity',
                args: { nums: [3, 4, 1, 2] },
            }),
        ).toBe(false);

        expect(
            resultsMatch([4, 5, 2, 1], [], 'validator-required', {
                problemId: 'sort-array-by-parity-ii',
                args: { nums: [4, 1, 2, 5] },
            }),
        ).toBe(true);
        expect(
            resultsMatch([4, 2, 5, 1], [], 'validator-required', {
                problemId: 'sort-array-by-parity-ii',
                args: { nums: [4, 1, 2, 5] },
            }),
        ).toBe(false);

        expect(
            resultsMatch([1, 3, 2, -6], [], 'validator-required', {
                problemId: 'find-n-unique-integers-sum-up-to-zero',
                args: { n: 4 },
            }),
        ).toBe(true);
        expect(
            resultsMatch([1, 1, -2], [], 'validator-required', {
                problemId: 'find-n-unique-integers-sum-up-to-zero',
                args: { n: 3 },
            }),
        ).toBe(false);

        const advantageArgs = { nums1: [2, 7, 11, 15], nums2: [1, 10, 4, 11] };
        // 题面返回 `nums1` 的重排；`[2, 11, 7, 15]` 取得全部 4 个优势位。
        expect(resultsMatch([2, 11, 7, 15], [], 'validator-required', { problemId: 'advantage-shuffle', args: advantageArgs })).toBe(true);
        // `[1, 4, 10, 11]` 是 `nums2` 的排列，不是 `nums1` 的排列。
        expect(resultsMatch([1, 4, 10, 11], [], 'validator-required', { problemId: 'advantage-shuffle', args: advantageArgs })).toBe(false);
    });

    it('无解用例的语义校验器接受空答案', () => {
        expect(
            resultsMatch(null, null, 'validator-required', {
                problemId: 'fair-candy-swap',
                args: { aliceSizes: [3, 7], bobSizes: [1, 9] },
            }),
        ).toBe(true);
        expect(
            resultsMatch([], [], 'validator-required', {
                problemId: 'find-missing-observations',
                args: { rolls: [1, 3, 5], mean: 2, n: 2 },
            }),
        ).toBe(true);
        expect(
            resultsMatch([1, 1], [], 'validator-required', {
                problemId: 'find-missing-observations',
                args: { rolls: [1, 3, 5], mean: 2, n: 2 },
            }),
        ).toBe(false);
    });

    it('assertTestCase 按传入模式比较', () => {
        expect(() => assertTestCase(0, [[1], [2], [1, 2]], () => [[2], [1, 2], [1]], undefined, 'unordered-2d')).not.toThrow();
        expect(() => assertTestCase(0, [[1], [2]], () => [[2], [1]], undefined, 'strict')).toThrow();
    });

    it('canonicalForm 对非数组值退化为单值键', () => {
        expect(canonicalForm(3, 'unordered-2d')).toBe(canonicalForm(3, 'unordered-1d'));
        expect(canonicalForm('x', 'outer-only')).toBe('scalar:s:"x"');
    });
});
