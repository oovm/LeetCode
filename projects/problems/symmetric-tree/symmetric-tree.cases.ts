// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 3]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3]
            },
            "expected": true
        },
        {
            "args": {
                "root": [2, 3, 3, 4, 5, 5, 4]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 8, 7, 6, 5]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 3, 4]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 5, 3]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1]
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 9, 9, 8, 7, 6, 5, 10, 11, 11, 10, 12, 13, 13, 12]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 9, 10, 11, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 9, 8, 7, 6, 5]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 9, 10, 11, 12]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 6, 5]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 8, 7, 6, 5, 9, 10, 10, 9, 11, 12, 12, 11, 13, 14, 15, 15, 14, 13]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 7, 8, 8, 7, 6, 5, 9, 10, 10, 9, 11, 12, 12, 11, 13, 14, 14, 13]
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 2, 3, 4, 4, 3, 5, 6, 6, 5, 7, 8, 8, 7]
            },
            "expected": false
        }
    ];
