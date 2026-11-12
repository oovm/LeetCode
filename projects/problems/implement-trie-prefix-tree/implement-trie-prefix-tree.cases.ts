// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "operations": [
                    "Trie",
                    "insert",
                    "search",
                    "search",
                    "startsWith",
                    "insert",
                    "search"
                ],
                "arguments": [
                    [],
                    ["apple"],
                    ["apple"],
                    ["app"],
                    ["app"],
                    ["app"],
                    ["app"]
                ]
            },
            "expected": [null, null, true, false, true, null, true]
        },
        {
            "args": {
                "operations": [
                    "Trie",
                    "insert",
                    "search",
                    "startsWith",
                    "insert",
                    "search",
                    "search"
                ],
                "arguments": [
                    [],
                    ["app"],
                    ["app"],
                    ["ap"],
                    ["apple"],
                    ["appl"],
                    ["apple"]
                ]
            },
            "expected": [null, null, true, true, null, false, true]
        }
    ];
