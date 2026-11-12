// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "operations": [
                    "MyHashSet",
                    "add",
                    "add",
                    "contains",
                    "contains",
                    "remove",
                    "contains"
                ],
                "arguments": [[], [1], [2], [1], [3], [2], [2]]
            },
            "expected": [null, null, null, true, false, null, false]
        },
        {
            "args": {
                "operations": ["MyHashSet", "add", "add", "remove", "contains"],
                "arguments": [[], [5], [5], [5], [5]]
            },
            "expected": [null, null, null, null, false]
        }
    ];
