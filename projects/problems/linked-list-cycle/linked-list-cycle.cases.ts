// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "head": [1, 2]
            },
            "expected": false
        },
        {
            "args": {
                "head": [1]
            },
            "expected": false
        },
        {
            "args": {
                "head": []
            },
            "expected": false
        },
        {
            "args": {
                "head": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1]
            },
            "expected": false
        },
        {
            "args": {
                "head": [3, 2, 0, -4]
            },
            "expected": false
        },
        {
            "args": {
                "head": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            "expected": false
        }
    ];
