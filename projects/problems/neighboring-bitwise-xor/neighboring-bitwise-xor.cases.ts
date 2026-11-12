// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "derived": [0, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 0, 1, 0, 1, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 1, 0, 1, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 1, 0, 0, 0, 1, 1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 0, 1, 1, 0, 1, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 0, 0, 1, 1, 0, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 0, 0, 1, 1, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [
                    0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0,
                    1, 1, 0, 0
                ]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": false
        },
        {
            "args": {
                "derived": [1, 1, 1, 1, 0, 0, 0, 0, 1, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]
            },
            "expected": true
        },
        {
            "args": {
                "derived": [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1]
            },
            "expected": true
        }
    ];
