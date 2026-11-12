// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "operations": [
                    "LFUCache",
                    "put",
                    "put",
                    "get",
                    "put",
                    "get",
                    "get",
                    "put",
                    "get",
                    "get",
                    "get"
                ],
                "arguments": [
                    [2],
                    [1, 1],
                    [2, 2],
                    [1],
                    [3, 3],
                    [2],
                    [3],
                    [4, 4],
                    [1],
                    [3],
                    [4]
                ]
            },
            "expected": [null, null, null, 1, null, -1, 3, null, -1, 3, 4]
        },
        {
            "args": {
                "operations": ["LFUCache", "put", "get", "put", "get", "get"],
                "arguments": [[2], [1, 1], [1], [2, 2], [3], [2]]
            },
            "expected": [null, null, 1, null, -1, 2]
        }
    ];
