// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "n": 1,
                "edges": [],
                "source": 0,
                "destination": 0
            },
            "expected": true
        },
        {
            "args": {
                "n": 100,
                "edges": [],
                "source": 0,
                "destination": 99
            },
            "expected": false
        },
        {
            "args": {
                "n": 25,
                "edges": [
                    [0, 1],
                    [1, 2],
                    [2, 3],
                    [3, 4],
                    [4, 5],
                    [5, 6],
                    [6, 7],
                    [7, 8],
                    [8, 9],
                    [9, 10],
                    [10, 11],
                    [11, 12],
                    [12, 13],
                    [13, 14],
                    [14, 15],
                    [15, 16],
                    [16, 17],
                    [17, 18],
                    [18, 19],
                    [19, 20],
                    [20, 21],
                    [21, 22],
                    [22, 23],
                    [23, 24],
                    [24, 0]
                ],
                "source": 15,
                "destination": 10
            },
            "expected": true
        },
        {
            "args": {
                "n": 15,
                "edges": [
                    [0, 1],
                    [1, 2],
                    [2, 3],
                    [3, 4],
                    [4, 5],
                    [5, 6],
                    [6, 7],
                    [7, 8],
                    [8, 9],
                    [9, 10],
                    [10, 11],
                    [11, 12],
                    [12, 13],
                    [13, 14]
                ],
                "source": 14,
                "destination": 0
            },
            "expected": true
        }
    ];
