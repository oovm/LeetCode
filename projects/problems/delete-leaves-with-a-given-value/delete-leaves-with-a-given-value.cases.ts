// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "root": [1000, 1000, 1000, 1000, 1000, 1000, 1000],
                "target": 1000
            },
            "expected": null
        },
        {
            "args": {
                "root": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                "target": 1
            },
            "expected": null
        },
        {
            "args": {
                "root": [1, 3, 3, 3, 2],
                "target": 3
            },
            "expected": [1, 3, null, null, 2]
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                "target": 15
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2],
                "target": 3
            },
            "expected": [1, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2]
        },
        {
            "args": {
                "root": [1, 2, 3],
                "target": 4
            },
            "expected": [1, 2, 3]
        },
        {
            "args": {
                "root": [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                "target": 2
            },
            "expected": [1]
        },
        {
            "args": {
                "root": [1, 2, 3],
                "target": 2
            },
            "expected": [1, null, 3]
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7],
                "target": 7
            },
            "expected": [1, 2, 3, 4, 5, 6]
        },
        {
            "args": {
                "root": [1, 1, 1, 1, 1, 1, 1],
                "target": 1
            },
            "expected": null
        },
        {
            "args": {
                "root": [1, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                "target": 2
            },
            "expected": [1, null, 3]
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                "target": 10
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 11, 12, 13, 14, 15]
        },
        {
            "args": {
                "root": [1],
                "target": 1
            },
            "expected": null
        },
        {
            "args": {
                "root": [1, 2, 3, 2, 2, 2, 4],
                "target": 2
            },
            "expected": [1, null, 3, null, 4]
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7],
                "target": 3
            },
            "expected": [1, 2, 3, 4, 5, 6, 7]
        },
        {
            "args": {
                "root": [1, 2, 3, 2, 2, 2, 2],
                "target": 2
            },
            "expected": [1, null, 3]
        }
    ];
