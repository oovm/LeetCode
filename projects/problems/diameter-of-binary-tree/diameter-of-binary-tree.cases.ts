// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7]
            },
            "expected": 4
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5]
            },
            "expected": 3
        },
        {
            "args": {
                "root": [1, 2, 3]
            },
            "expected": 2
        },
        {
            "args": {
                "root": [1, 2]
            },
            "expected": 1
        },
        {
            "args": {
                "root": [3, 1, 2]
            },
            "expected": 2
        },
        {
            "args": {
                "root": [1]
            },
            "expected": 0
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
            },
            "expected": 8
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
            },
            "expected": 8
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            "expected": 7
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            },
            "expected": 6
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            },
            "expected": 8
        }
    ];
