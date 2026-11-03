// 正例 fixture：超出 i64 的输入以 bigint 字面量承载，判题器按 bigint 判题。
import type { ProblemCases } from '../../../../src/isolated/cases.ts';

export const cases: ProblemCases = [
    { args: { n: 2 }, expected: 3 },
    { args: { n: 9007199254740993n }, expected: 9007199254740994n },
    { args: { n: 9223372036854775807n }, expected: 9223372036854775808n },
    { args: { n: 123456789012345678901234567890n }, expected: 123456789012345678901234567891n },
];
