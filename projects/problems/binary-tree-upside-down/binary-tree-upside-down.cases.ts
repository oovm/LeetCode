// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7]
            },
            "expected": [4, 5, 2, null, null, 3, 1, 6, 7]
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5]
            },
            "expected": [4, 5, 2, null, null, 3, 1]
        },
        {
            "args": {
                "root": [1, 2]
            },
            "expected": [2, null, 1]
        },
        {
            "args": {
                "root": [1]
            },
            "expected": [1]
        },
        {
            "args": {
                "root": []
            },
            "expected": null
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            "expected": [8, 9, 4, null, null, 5, 2, 10, null, 3, 1, null, null, 6, 7]
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            "expected": [
                16,
                17,
                8,
                null,
                null,
                9,
                4,
                18,
                19,
                5,
                2,
                null,
                null,
                null,
                null,
                10,
                11,
                3,
                1,
                20,
                null,
                null,
                null,
                6,
                7,
                null,
                null,
                null,
                null,
                12,
                13,
                14,
                15
            ]
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            },
            "expected": [8, 9, 4, null, null, 5, 2, 10, 11, 3, 1, null, null, null, null, 6, 7, null, null, 12, 13, 14, 15]
        }
    ];
