// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "maze": [[".", "+"]],
                "entrance": [0, 0]
            },
            "expected": -1
        },
        {
            "args": {
                "maze": [[".", ".", "."], [".", ".", "."], [".", ".", "."]],
                "entrance": [0, 1]
            },
            "expected": 1
        },
        {
            "args": {
                "maze": [[".", ".", ".", "."], [".", ".", ".", "."], [".", ".", ".", "."], [".", ".", ".", "."]],
                "entrance": [0, 0]
            },
            "expected": 1
        },
        {
            "args": {
                "maze": [[".", ".", "."], [".", ".", "."], [".", ".", "."]],
                "entrance": [2, 2]
            },
            "expected": 1
        },
        {
            "args": {
                "maze": [["+)", "+)", "+"], [".", ".", "."], ["+)", "+)", "+"]],
                "entrance": [1, 0]
            },
            "expected": 2
        },
        {
            "args": {
                "maze": [["+)", "+)", "."], [".", ".", ".", "+"], ["+)", "+)", "+)", "."]],
                "entrance": [1, 2]
            },
            "expected": 1
        },
        {
            "args": {
                "maze": [["+", ".", "+"], [".", ".", "."], ["+", ".", "+"]],
                "entrance": [1, 1]
            },
            "expected": 1
        },
        {
            "args": {
                "maze": [[".", ".", "+", "."], [".", ".", ".", "."], [".", ".", ".", "."], [".", ".", ".", "."]],
                "entrance": [0, 3]
            },
            "expected": 1
        },
        {
            "args": {
                "maze": [[".", ".", ".", "."], [".", "+", ".", "."], [".", ".", ".", "."], [".", ".", ".", "."]],
                "entrance": [1, 1]
            },
            "expected": 1
        },
        {
            "args": {
                "maze": [[".", ".", "."], [".", ".", "."], [".", ".", "."]],
                "entrance": [1, 1]
            },
            "expected": 1
        }
    ];
