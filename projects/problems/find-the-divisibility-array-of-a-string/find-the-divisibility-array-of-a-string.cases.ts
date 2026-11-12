// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "word": "1111111111",
                "m": 5
            },
            "expected": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
            "args": {
                "word": "998244353",
                "m": 3
            },
            "expected": [1, 1, 0, 0, 0, 1, 1, 0, 0]
        },
        {
            "args": {
                "word": "00000",
                "m": 1
            },
            "expected": [1, 1, 1, 1, 1]
        },
        {
            "args": {
                "word": "1010",
                "m": 10
            },
            "expected": [0, 1, 0, 1]
        },
        {
            "args": {
                "word": "00000",
                "m": 5
            },
            "expected": [1, 1, 1, 1, 1]
        },
        {
            "args": {
                "word": "1111111111",
                "m": 11
            },
            "expected": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
        }
    ];
