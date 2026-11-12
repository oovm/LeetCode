// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 1],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 1],
                "n": 1
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 1],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 1, 0, 0, 1],
                "n": 1
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 1, 0, 0, 0],
                "n": 2
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0],
                "n": 1
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 1, 0, 0, 1, 0, 0],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 1, 0],
                "n": 1
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 0, 1, 0, 0, 1, 0],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0],
                "n": 1
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0],
                "n": 1
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 1],
                "n": 2
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                "n": 10
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                "n": 2
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                "n": 2
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                "n": 3
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                "n": 2
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                "n": 6
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                "n": 4
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 7
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                "n": 6
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
                "n": 5
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                "n": 5
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                "n": 2
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                "n": 15
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                "n": 8
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                "n": 2
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 8
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 6
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                "n": 6
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 10
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 13
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 0, 1],
                "n": 3
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                "n": 4
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 3
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
                "n": 3
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 1, 0, 1, 0, 0],
                "n": 1
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                "n": 2
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
                "n": 2
            },
            "expected": false
        },
        {
            "args": {
                "flowerbed": [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 15
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                "n": 5
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                "n": 4
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "n": 10
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
                "n": 0
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
                "n": 3
            },
            "expected": true
        },
        {
            "args": {
                "flowerbed": [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                "n": 6
            },
            "expected": true
        }
    ];
