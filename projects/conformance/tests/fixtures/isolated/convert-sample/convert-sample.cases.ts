// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../../../src/isolated/cases.ts';

export const cases: ProblemCases = [
        { "args": { "n": 7 }, "expected": 8 },
        { "args": { "n": 123456789012345678901234567890n }, "expected": 123456789012345678901234567891n },
        { "args": { "n": 340282366920938463463374607431768211455n }, "expected": 340282366920938463463374607431768211456n },
        { "args": { "s": "1011001101110000110100100101011001011010100111001010100110101001" }, "expected": "ok" },
        { "args": { "n": 18446744073709551615n }, "expected": 18446744073709551616n },
        { "args": { "n": 1 }, "expected": 1.0000000000000001e+30, "corpusDefect": { "kind": "float_literal", "reason": "原文已浮点化，无法恢复原值" } }
    ];
