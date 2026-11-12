// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "preorder": [1, 3, 2],
                "postorder": [3, 2, 1]
            },
            "expected": [1, 3, 2]
        },
        {
            "args": {
                "preorder": [1],
                "postorder": [1]
            },
            "expected": [1]
        },
        {
            "args": {
                "preorder": [1, 2, 3],
                "postorder": [2, 3, 1]
            },
            "expected": [1, 2, 3]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 5, 3, 6, 7],
                "postorder": [4, 5, 2, 6, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 5, 3],
                "postorder": [4, 5, 2, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5]
        },
        {
            "args": {
                "preorder": [1, 2, 3, 4, 5],
                "postorder": [4, 5, 3, 2, 1]
            },
            "expected": [1, 2, null, 3, null, 4, 5]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 5, 3, 6, 8, 9, 7],
                "postorder": [4, 5, 2, 8, 9, 6, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, null, null, null, null, 8, 9]
        },
        {
            "args": {
                "preorder": [1, 3, 6, 11, 12, 7, 13, 2, 4, 8, 9, 5, 10],
                "postorder": [11, 12, 6, 13, 7, 3, 8, 9, 4, 10, 5, 2, 1]
            },
            "expected": [1, 3, 2, 6, 7, 4, 5, 11, 12, 13, null, 8, 9, 10]
        },
        {
            "args": {
                "preorder": [1, 3, 2, 5, 4, 6],
                "postorder": [3, 4, 5, 2, 6, 1]
            },
            "expected": [1, 3, 2, null, null, 5, 6, 4]
        },
        {
            "args": {
                "preorder": [1, 3, 5, 6, 2, 4, 7],
                "postorder": [5, 6, 3, 7, 4, 2, 1]
            },
            "expected": [1, 3, 2, 5, 6, 4, null, null, null, null, null, 7]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 7, 8, 5, 9, 3, 6],
                "postorder": [7, 8, 4, 9, 5, 2, 6, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, null, 7, 8, 9]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 8, 9, 5, 10, 11, 3, 6, 12, 7, 13, 14],
                "postorder": [8, 9, 4, 10, 11, 5, 2, 12, 6, 13, 14, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, null, 13, 14]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 8, 9, 5, 10, 3, 6, 11, 12, 7, 13, 14],
                "postorder": [8, 9, 4, 10, 5, 2, 11, 12, 6, 13, 14, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, null, 11, 12, 13, 14]
        },
        {
            "args": {
                "preorder": [6, 2, 1, 0, 3, 5, 4, 8, 7, 9],
                "postorder": [0, 1, 5, 4, 3, 2, 7, 9, 8, 6]
            },
            "expected": [6, 2, 8, 1, 3, 7, 9, 0, null, 5, 4]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 8, 5, 9, 3, 6, 10, 7, 11],
                "postorder": [8, 4, 9, 5, 2, 10, 6, 11, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, 8, null, 9, null, 10, null, 11]
        },
        {
            "args": {
                "preorder": [1, 3, 6, 5, 2, 4, 7, 8, 9],
                "postorder": [6, 5, 3, 8, 9, 7, 4, 2, 1]
            },
            "expected": [1, 3, 2, 6, 5, 4, null, null, null, null, null, 7, null, 8, 9]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 8, 9, 5, 3, 6, 7],
                "postorder": [8, 9, 4, 5, 2, 6, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, 8, 9]
        },
        {
            "args": {
                "preorder": [5, 4, 2, 1, 3, 6, 7, 8, 9, 10],
                "postorder": [1, 3, 2, 4, 10, 9, 8, 7, 6, 5]
            },
            "expected": [5, 4, 6, 2, null, 7, null, 1, 3, 8, null, null, null, null, null, 9, null, 10]
        },
        {
            "args": {
                "preorder": [1, 3, 2, 5, 4, 6],
                "postorder": [2, 4, 6, 5, 3, 1]
            },
            "expected": [1, 3, null, 2, 5, null, null, 4, 6]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 5, 3, 6, 8, 7, 9],
                "postorder": [4, 5, 2, 8, 6, 9, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, null, null, null, null, 8, null, 9]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 5, 3, 6, 7, 8, 9],
                "postorder": [4, 5, 2, 6, 8, 9, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, null, null, null, null, null, null, 8, 9]
        },
        {
            "args": {
                "preorder": [1, 3, 5, 4, 2, 6, 7],
                "postorder": [5, 4, 3, 6, 7, 2, 1]
            },
            "expected": [1, 3, 2, 5, 4, 6, 7]
        },
        {
            "args": {
                "preorder": [1, 3, 2, 6, 5, 4, 7, 9, 8, 11, 10],
                "postorder": [2, 5, 6, 4, 3, 9, 10, 11, 8, 7, 1]
            },
            "expected": [1, 3, 7, 2, 6, 9, 8, null, null, 5, 4, null, null, 11, null, null, null, null, null, 10]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 3, 5, 6],
                "postorder": [4, 2, 6, 5, 3, 1]
            },
            "expected": [1, 2, 3, 4, null, 5, null, null, null, 6]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 8, 9, 5, 10, 3, 6, 7],
                "postorder": [8, 9, 4, 10, 5, 2, 6, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 5, 3, 6, 8, 9, 7, 10, 11],
                "postorder": [4, 5, 2, 8, 9, 6, 10, 11, 7, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 6, 7, null, null, null, null, 8, 9, 10, 11]
        },
        {
            "args": {
                "preorder": [1, 2, 3, 5, 6, 4, 7, 8],
                "postorder": [5, 6, 3, 7, 8, 4, 2, 1]
            },
            "expected": [1, 2, null, 3, 4, 5, 6, 7, 8]
        },
        {
            "args": {
                "preorder": [1, 2, 5, 9, 10, 6, 7, 3, 8, 4],
                "postorder": [9, 10, 5, 7, 6, 2, 8, 4, 3, 1]
            },
            "expected": [1, 2, 3, 5, 6, 8, 4, 9, 10, 7]
        },
        {
            "args": {
                "preorder": [1, 2, 4, 7, 8, 5, 9, 6, 3, 10, 11],
                "postorder": [7, 8, 4, 9, 5, 6, 2, 10, 11, 3, 1]
            },
            "expected": [1, 2, 3, 4, 5, 10, 11, 7, 8, 9, 6]
        }
    ];
