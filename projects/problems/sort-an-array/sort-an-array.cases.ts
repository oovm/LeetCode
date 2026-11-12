// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "nums": [0]
            },
            "expected": [0]
        },
        {
            "args": {
                "nums": [-1]
            },
            "expected": [-1]
        },
        {
            "args": {
                "nums": [50000]
            },
            "expected": [50000]
        },
        {
            "args": {
                "nums": [-50000]
            },
            "expected": [-50000]
        },
        {
            "args": {
                "nums": [1]
            },
            "expected": [1]
        }
    ];
