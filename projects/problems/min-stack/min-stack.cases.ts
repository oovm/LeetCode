// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "operations": [
                    "MinStack",
                    "push",
                    "push",
                    "push",
                    "getMin",
                    "pop",
                    "top",
                    "getMin"
                ],
                "arguments": [[], [-2], [0], [-3], [], [], [], []]
            },
            "expected": [null, null, null, null, -3, null, 0, -2]
        },
        {
            "args": {
                "operations": ["MinStack", "push", "push", "getMin", "pop", "getMin", "top"],
                "arguments": [[], [0], [2], [], [], [], []]
            },
            "expected": [null, null, null, 0, null, 0, 0]
        }
    ];
