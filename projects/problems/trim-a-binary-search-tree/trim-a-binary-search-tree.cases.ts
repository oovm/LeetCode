// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "root": [1],
                "low": 1,
                "high": 2
            },
            "expected": [1]
        },
        {
            "args": {
                "root": [2, 1, 3],
                "low": 1,
                "high": 2
            },
            "expected": [2, 1]
        },
        {
            "args": {
                "root": [1, 0, 2],
                "low": 1,
                "high": 2
            },
            "expected": [1, null, 2]
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5],
                "low": 4,
                "high": 5
            },
            "expected": null
        },
        {
            "args": {
                "root": [1],
                "low": 0,
                "high": 0
            },
            "expected": null
        }
    ];
