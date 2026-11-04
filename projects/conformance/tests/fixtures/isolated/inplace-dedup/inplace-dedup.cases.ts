// 反例防护：题解原地改写 nums；判题器必须每次传入独立副本，计时轮不得污染断言轮。
import type { ProblemCases } from '../../../../src/isolated/cases.ts';

export const cases: ProblemCases = [
    {
        args: { nums: [1, 2, 2, 3, 3, 3, 4] },
        expected: 4,
    },
];
