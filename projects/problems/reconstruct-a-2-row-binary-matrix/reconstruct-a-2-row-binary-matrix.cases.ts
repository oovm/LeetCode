// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "upper": 2,
                "lower": 3,
                "colsum": [2, 2, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 1,
                "lower": 1,
                "colsum": [1, 0, 1]
            },
            "expected": [[0, 0, 1], [1, 0, 0]]
        },
        {
            "args": {
                "upper": 4,
                "lower": 2,
                "colsum": [2, 1, 1, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 3,
                "lower": 3,
                "colsum": [2, 0, 2, 0, 2]
            },
            "expected": [[1, 0, 1, 0, 1], [1, 0, 1, 0, 1]]
        },
        {
            "args": {
                "upper": 0,
                "lower": 0,
                "colsum": [0, 0, 0, 0]
            },
            "expected": [[0, 0, 0, 0], [0, 0, 0, 0]]
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [2, 1, 2, 0, 1, 0, 1, 2, 0, 1]
            },
            "expected": [[1, 0, 1, 0, 1, 0, 0, 1, 0, 1], [1, 1, 1, 0, 0, 0, 1, 1, 0, 0]]
        },
        {
            "args": {
                "upper": 2,
                "lower": 1,
                "colsum": [1, 1, 1]
            },
            "expected": [[1, 0, 1], [0, 1, 0]]
        },
        {
            "args": {
                "upper": 10,
                "lower": 10,
                "colsum": [2, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 0,
                "lower": 0,
                "colsum": [0, 0, 0, 0, 0]
            },
            "expected": [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 15,
                "lower": 5,
                "colsum": [2, 1, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 3,
                "lower": 2,
                "colsum": [2, 1, 1, 0, 1]
            },
            "expected": [[1, 1, 0, 0, 1], [1, 0, 1, 0, 0]]
        },
        {
            "args": {
                "upper": 3,
                "lower": 3,
                "colsum": [1, 1, 1, 1, 1, 1]
            },
            "expected": [[0, 1, 0, 1, 0, 1], [1, 0, 1, 0, 1, 0]]
        },
        {
            "args": {
                "upper": 6,
                "lower": 4,
                "colsum": [2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [2, 1, 1, 0, 0, 0, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 6,
                "lower": 4,
                "colsum": [2, 2, 1, 1, 0, 0, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 10,
                "lower": 6,
                "colsum": [2, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 7,
                "lower": 5,
                "colsum": [1, 2, 1, 2, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [2, 1, 2, 0, 1, 0, 1, 2, 0, 1]
            },
            "expected": [[1, 0, 1, 0, 1, 0, 0, 1, 0, 1], [1, 1, 1, 0, 0, 0, 1, 1, 0, 0]]
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [0, 1, 2, 0, 0, 1, 2, 1, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 8,
                "lower": 2,
                "colsum": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 3,
                "lower": 1,
                "colsum": [1, 2, 1, 1, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 3,
                "lower": 2,
                "colsum": [1, 1, 1, 1, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 1,
                "lower": 1,
                "colsum": [2]
            },
            "expected": [[1], [1]]
        },
        {
            "args": {
                "upper": 3,
                "lower": 6,
                "colsum": [2, 2, 1, 1, 1, 2, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [2, 1, 0, 1, 0, 2, 1, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 2,
                "lower": 2,
                "colsum": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 1,
                "lower": 2,
                "colsum": [1, 1, 0, 0, 1]
            },
            "expected": [[0, 0, 0, 0, 1], [1, 1, 0, 0, 0]]
        },
        {
            "args": {
                "upper": 4,
                "lower": 4,
                "colsum": [2, 0, 1, 1, 2, 1, 1, 0]
            },
            "expected": [[1, 0, 0, 1, 1, 0, 1, 0], [1, 0, 1, 0, 1, 1, 0, 0]]
        },
        {
            "args": {
                "upper": 1,
                "lower": 1,
                "colsum": [2, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": [[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
        },
        {
            "args": {
                "upper": 2,
                "lower": 2,
                "colsum": [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2]
            },
            "expected": [[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]]
        },
        {
            "args": {
                "upper": 3,
                "lower": 3,
                "colsum": [2, 0, 1, 1, 2]
            },
            "expected": [[1, 0, 0, 1, 1], [1, 0, 1, 0, 1]]
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [1, 2, 0, 2, 1, 0, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 8,
                "lower": 8,
                "colsum": [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 4,
                "lower": 4,
                "colsum": [2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 6,
                "lower": 6,
                "colsum": [2, 1, 0, 2, 1, 0, 1, 1, 0, 0, 2, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 7,
                "lower": 3,
                "colsum": [1, 0, 1, 2, 1, 0, 1, 1, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 3,
                "lower": 3,
                "colsum": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 3,
                "lower": 2,
                "colsum": [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [0, 1, 2, 1, 1, 0, 2, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 3,
                "lower": 4,
                "colsum": [1, 2, 1, 1, 0, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 6,
                "lower": 4,
                "colsum": [2, 1, 1, 1, 1, 2, 0, 1, 1, 0]
            },
            "expected": [[1, 1, 1, 0, 1, 1, 0, 0, 1, 0], [1, 0, 0, 1, 0, 1, 0, 1, 0, 0]]
        },
        {
            "args": {
                "upper": 7,
                "lower": 3,
                "colsum": [1, 2, 1, 1, 1, 0, 0, 2]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 10,
                "lower": 10,
                "colsum": [2, 2, 2, 2, 2, 0, 0, 0, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 3,
                "colsum": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 9,
                "lower": 9,
                "colsum": [2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 8,
                "lower": 6,
                "colsum": [2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 8,
                "lower": 7,
                "colsum": [2, 2, 2, 0, 1, 1, 0, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 10,
                "lower": 10,
                "colsum": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 4,
                "colsum": [2, 1, 1, 1, 0, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 8,
                "lower": 4,
                "colsum": [2, 2, 2, 2, 0, 0, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 4,
                "lower": 5,
                "colsum": [1, 1, 1, 1, 2, 1, 0, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 3,
                "colsum": [1, 1, 1, 2, 1, 2, 0, 0]
            },
            "expected": [[1, 1, 0, 1, 1, 1, 0, 0], [0, 0, 1, 1, 0, 1, 0, 0]]
        },
        {
            "args": {
                "upper": 10,
                "lower": 5,
                "colsum": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 7,
                "lower": 3,
                "colsum": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": [[1, 1, 1, 1, 0, 1, 0, 1, 0, 1], [0, 0, 0, 0, 1, 0, 1, 0, 1, 0]]
        },
        {
            "args": {
                "upper": 3,
                "lower": 3,
                "colsum": [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
            },
            "expected": [[0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]]
        },
        {
            "args": {
                "upper": 10,
                "lower": 10,
                "colsum": [2, 2, 2, 2, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 8,
                "lower": 8,
                "colsum": [1, 2, 2, 1, 2, 1, 1, 2]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 1,
                "lower": 1,
                "colsum": [0, 0, 0, 0, 0, 2]
            },
            "expected": [[0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1]]
        },
        {
            "args": {
                "upper": 0,
                "lower": 0,
                "colsum": [0, 0, 0, 0, 0]
            },
            "expected": [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]
        },
        {
            "args": {
                "upper": 3,
                "lower": 4,
                "colsum": [2, 1, 2, 0, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 10,
                "lower": 10,
                "colsum": [2, 1, 2, 1, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 0, 0, 0, 1, 1, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 7,
                "lower": 3,
                "colsum": [1, 2, 1, 1, 0, 2, 1, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 7,
                "lower": 8,
                "colsum": [2, 2, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 7,
                "lower": 5,
                "colsum": [1, 2, 2, 1, 1, 0, 0, 0, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 3,
                "lower": 3,
                "colsum": [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 5,
                "lower": 5,
                "colsum": [2, 0, 2, 0, 1, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 7,
                "lower": 3,
                "colsum": [2, 1, 2, 1, 0, 0, 0, 1, 1, 0, 0, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 10,
                "lower": 5,
                "colsum": [2, 2, 2, 1, 1, 1, 1, 1, 1, 0]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 6,
                "lower": 6,
                "colsum": [2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
            },
            "expected": []
        },
        {
            "args": {
                "upper": 4,
                "lower": 4,
                "colsum": [
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
                ]
            },
            "expected": []
        }
    ];
