// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "grid": [["B", "W", "B"], ["W", "B", "W"], ["B", "W", "B"]]
            },
            "expected": false
        },
        {
            "args": {
                "grid": [["B", "B", "W"], ["B", "B", "W"], ["B", "B", "W"]]
            },
            "expected": true
        },
        {
            "args": {
                "grid": [["B", "W", "B"], ["B", "W", "W"], ["B", "W", "B"]]
            },
            "expected": true
        },
        {
            "args": {
                "grid": [["B", "B", "B"], ["B", "W", "B"], ["B", "B", "B"]]
            },
            "expected": true
        },
        {
            "args": {
                "grid": [["W", "W", "B"], ["W", "W", "B"], ["W", "W", "B"]]
            },
            "expected": true
        },
        {
            "args": {
                "grid": [["W", "W", "W"], ["W", "B", "W"], ["W", "W", "W"]]
            },
            "expected": true
        },
        {
            "args": {
                "grid": [["B", "W", "W"], ["W", "W", "W"], ["W", "W", "B"]]
            },
            "expected": true
        },
        {
            "args": {
                "grid": [["W", "B", "W"], ["B", "W", "B"], ["W", "B", "W"]]
            },
            "expected": false
        },
        {
            "args": {
                "grid": [["B", "W", "B"], ["B", "W", "W"], ["B", "W", "W"]]
            },
            "expected": true
        },
        {
            "args": {
                "grid": [["W", "B", "B"], ["B", "B", "B"], ["B", "B", "W"]]
            },
            "expected": true
        }
    ];
