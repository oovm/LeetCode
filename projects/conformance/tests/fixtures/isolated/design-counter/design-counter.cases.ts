// 正例 fixture：设计类题目的操作序列（构造参数与操作参数分属两层，实例状态跨步共享）。
import type { ProblemCases } from '../../../../src/isolated/cases.ts';

export const cases: ProblemCases = [
    {
        args: {
            operations: ['Counter', 'inc', 'add', 'get'],
            arguments: [[], [], [2], []],
        },
        expected: [null, null, null, 3],
    },
    {
        args: {
            operations: ['Counter', 'add', 'get', 'reset', 'get'],
            arguments: [[5], [2], [], [], []],
        },
        expected: [null, null, 7, null, 0],
    },
];
