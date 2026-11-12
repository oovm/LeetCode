// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1]
            },
            "expected": true
        },
        {
            "args": {
                "root": []
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 9, 9, 9, 9]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
            },
            "expected": true
        }
    ];
