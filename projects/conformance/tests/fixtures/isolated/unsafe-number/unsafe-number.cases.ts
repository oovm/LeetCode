// 反例 fixture：越过安全整数却用 number 承载同值，判题器必须拒绝（unsafe_number），不得静默降级。
import type { ProblemCases } from '../../../../src/isolated/cases.ts';

export const cases: ProblemCases = [{ args: { n: 9223372036854775808 }, expected: 9223372036854775809 }];
