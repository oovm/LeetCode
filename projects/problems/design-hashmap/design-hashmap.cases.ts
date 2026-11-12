// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "operations": [
                    "MyHashMap",
                    "put",
                    "put",
                    "get",
                    "get",
                    "put",
                    "get",
                    "remove",
                    "get"
                ],
                "arguments": [
                    [],
                    [1, 1],
                    [2, 2],
                    [1],
                    [3],
                    [2, 1],
                    [2],
                    [2],
                    [2]
                ]
            },
            "expected": [null, null, null, 1, -1, null, 1, null, -1]
        },
        {
            "args": {
                "operations": ["MyHashMap", "put", "get", "remove", "get"],
                "arguments": [[], [1, 3], [1], [1], [1]]
            },
            "expected": [null, null, 3, null, -1]
        }
    ];
