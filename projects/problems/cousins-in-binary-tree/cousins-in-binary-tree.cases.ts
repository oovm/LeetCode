// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7],
                "x": 2,
                "y": 3
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 3, 4],
                "x": 4,
                "y": 3
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7],
                "x": 4,
                "y": 7
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7],
                "x": 4,
                "y": 6
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7],
                "x": 5,
                "y": 7
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7],
                "x": 6,
                "y": 5
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                "x": 8,
                "y": 11
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7],
                "x": 4,
                "y": 5
            },
            "expected": false
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                "x": 10,
                "y": 14
            },
            "expected": true
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                "x": 3,
                "y": 15
            },
            "expected": false
        }
    ];
