// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "operations": [
                    "LRUCache",
                    "put",
                    "put",
                    "get",
                    "put",
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
                    [4, 4],
                    [1],
                    [3],
                    [4]
                ]
            },
            "expected": [null, null, null, 1, null, -1, null, -1, 3, 4]
        },
        {
            "args": {
                "operations": ["LRUCache", "put", "get", "put", "get"],
                "arguments": [[1], [2, 1], [2], [3, 2], [2]]
            },
            "expected": [null, null, 1, null, -1]
        }
    ];
