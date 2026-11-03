// 反例 fixture：缺 args 的非法 schema，判题器必须结构化失败（cases_schema）。
import type { ProblemCases } from '../../../../src/isolated/cases.ts';

export const cases = [{ expected: 3 }] as unknown as ProblemCases;
