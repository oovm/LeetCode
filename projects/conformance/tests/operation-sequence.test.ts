/**
 * 设计类操作序列模型的最小复现测试：
 * 构造参数与操作参数分层、实例状态跨步共享、逐步失败能定位到 `tests[i].step[j]`。
 */
import { describe, expect, it } from 'vitest';

import {
    assertOperationSequence,
    isOperationSequenceArgs,
    isOperationSequenceCase,
    runOperationSequence,
} from '../src/domain/operation-sequence.ts';

class Counter {
    private value: number;

    constructor(initial = 0) {
        this.value = initial;
    }

    add(delta: number): void {
        this.value += delta;
    }

    get(): number {
        return this.value;
    }
}

describe('operation sequence 识别', () => {
    it('operations + arguments 双键且形状完整才算操作序列', () => {
        const args = {
            operations: ['Counter', 'add', 'get'],
            arguments: [[100], [2], []],
        };
        expect(isOperationSequenceArgs(args)).toBe(true);
        expect(isOperationSequenceCase({ args, expected: [null, null, 102] })).toBe(true);
    });

    it('单调用 args（如 { n: 2 }）不会被误判为操作序列', () => {
        expect(isOperationSequenceArgs({ n: 2 })).toBe(false);
        expect(isOperationSequenceArgs({ operations: ['Counter'] })).toBe(false);
        expect(isOperationSequenceArgs({ operations: ['Counter'], arguments: [[], []] })).toBe(false);
    });
});

describe('operation sequence 执行', () => {
    it('构造参数只作用于构造函数，后续操作按各自实参调用且共享同一实例', () => {
        const sequence = {
            operations: ['Counter', 'add', 'get'],
            arguments: [[100], [2], []],
        };
        const results = runOperationSequence('Counter', Counter as never, sequence);
        expect(results).toEqual([null, null, 102]);
    });

    it('方法缺失 → 结构化失败并指明第几步、哪个操作', () => {
        const sequence = { operations: ['Counter', 'missing'], arguments: [[], []] };
        expect(() => runOperationSequence('Counter', Counter as never, sequence)).toThrow(
            /操作序列第 1 步 "missing"：实例上不存在该方法/,
        );
    });

    it('每步断言失败 → 报错带 tests[i].step[j] (op)', () => {
        const sequence = {
            operations: ['Counter', 'add', 'get'],
            arguments: [[100], [2], []],
        };
        expect(() => assertOperationSequence(3, sequence, [null, null, 103], [null, null, 102])).toThrow(
            /tests\[3\]\.step\[2\] \(get\): expected 103, got 102/,
        );
    });

    it('返回长度不符 → 指明操作序列步数', () => {
        const sequence = {
            operations: ['Counter', 'add', 'get'],
            arguments: [[100], [2], []],
        };
        expect(() => assertOperationSequence(1, sequence, [null, null, 102], [null, null])).toThrow(
            /操作序列有 3 步，期望 3 个返回值，实际 2 个/,
        );
    });
});
