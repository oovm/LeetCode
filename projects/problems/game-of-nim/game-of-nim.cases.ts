// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "piles": [5, 3, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 2, 3, 4, 5, 6, 7]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [7, 6, 5, 4, 3, 2, 1]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [1, 2, 3]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 3, 5, 7]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [3, 3, 3, 3]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [2, 2, 2]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 2, 3, 4]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 7, 7]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [2, 2, 2, 2]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [7, 7, 7, 7, 7, 7, 7]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [4, 1, 2]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [4, 4, 4, 4]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [2, 2, 2, 2, 2, 2, 2]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 1, 1, 1, 1, 1, 7]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 1, 1, 1, 1, 1, 2]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 1, 3, 5, 2]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [2, 2, 2, 2, 2, 2]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [4, 2, 1, 3]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [2, 4, 6]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [1, 2, 2, 3, 3, 4]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 2, 2, 3, 4, 5, 6]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 1, 2, 2, 3, 3, 4]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 3, 3]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 2, 3, 4, 3, 2, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 1, 1, 1, 1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [4, 4, 4, 4, 4, 4, 4]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [2, 3, 5, 7, 11]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [2, 3, 4, 5, 6]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [2, 2, 2, 2, 2, 2, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 3, 5, 7, 9, 11, 13]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 7, 7, 7]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [4, 5, 6, 7, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [5, 4, 3, 2, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 2, 2, 3, 4, 4, 5]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 3, 5]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [4, 4, 4, 3, 3, 2, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 3, 3, 2, 2, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [5, 5, 5, 5, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 7, 5, 5, 3, 3, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [5, 5, 5, 4, 4, 3]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [3, 3, 2, 2, 1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [2, 3, 3, 2]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [6, 5, 4, 3, 2, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 1, 1, 1, 2, 2, 2]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [4, 4, 3, 3, 2, 2, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [3, 3, 3, 2, 2, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [6, 6, 6, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [6, 3, 5, 2, 4, 1, 7]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [6, 5, 4, 3, 2, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 1, 2, 3, 4, 5, 6]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [5, 5, 5, 5, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [4, 4, 4, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 1, 2, 3, 4, 5, 6]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [3, 3, 2, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [6, 3, 3, 2, 2, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [5, 5, 5, 5, 5, 5, 5]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [2, 2, 2, 2, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 3, 5, 7]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [6, 3, 1, 4]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [1, 2, 2, 3, 4, 5, 6]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [3, 5, 5, 5]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 1, 1, 1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 2, 2, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [4, 4, 4, 4, 4, 4, 3]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 1, 2, 3, 4]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 6, 5, 4, 3, 2, 1]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [3, 3, 3, 3, 3, 3, 3]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [2, 4, 6]
            },
            "expected": false
        },
        {
            "args": {
                "piles": [6, 3, 4, 2, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [3, 3, 3, 3, 3]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [7, 7, 7, 7, 7, 7, 7]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [6, 3, 1, 2, 5]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [4, 3, 2, 2, 2, 2, 2]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [1, 3, 3, 3]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [3, 3, 3, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "piles": [6, 6, 6, 6, 6, 6, 6]
            },
            "expected": true
        }
    ];
