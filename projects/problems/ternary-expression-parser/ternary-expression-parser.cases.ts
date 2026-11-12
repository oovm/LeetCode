// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "expression": "T?T?F:5:3"
            },
            "expected": "F"
        },
        {
            "args": {
                "expression": "T?F?T?F?T?F?T?F?1:2:3:4:5:6:7:8:9"
            },
            "expected": 8
        },
        {
            "args": {
                "expression": "F?F?F:2:3?4:5"
            },
            "expected": 5
        },
        {
            "args": {
                "expression": "F?T?2:3:F?1:0"
            },
            "expected": 0
        },
        {
            "args": {
                "expression": "T?T?T?T?T?9:8:7:6:5:4"
            },
            "expected": 9
        },
        {
            "args": {
                "expression": "F?F?F:5:T"
            },
            "expected": "T"
        },
        {
            "args": {
                "expression": "T?4:5?6:7"
            },
            "expected": 4
        },
        {
            "args": {
                "expression": "F?F?F?F?F?0:1:2:3:4:5"
            },
            "expected": 5
        },
        {
            "args": {
                "expression": "F?9:T?8:T?7:6"
            },
            "expected": 8
        },
        {
            "args": {
                "expression": "T?T?T?T?T?T?T?T?T?T:T:T:T:T:T:T:T:T:T:T"
            },
            "expected": "T"
        },
        {
            "args": {
                "expression": "T?T?T?T?T?1:2:3:4:5:6"
            },
            "expected": 1
        },
        {
            "args": {
                "expression": "F?F?F?F?F?F?F?F?F?9:8:7:6:5:4:3:2:1:0"
            },
            "expected": 0
        },
        {
            "args": {
                "expression": "F?F?5:9:T?F:9"
            },
            "expected": "F"
        },
        {
            "args": {
                "expression": "T?1:2?3:4"
            },
            "expected": 1
        },
        {
            "args": {
                "expression": "T?T?T?T?T?T?T?T?1:2:3:4:5:6:7:8:9"
            },
            "expected": 1
        },
        {
            "args": {
                "expression": "F?T?F?T?F?T?F?T?9:8:7:6:5:4:3:2:1"
            },
            "expected": 1
        },
        {
            "args": {
                "expression": "F?F?F?F?F?F?F?F?9:8:7:6:5:4:3:2:1"
            },
            "expected": 1
        },
        {
            "args": {
                "expression": "T?T?T?T?T?T?T?T?T?1:0:0:0:0:0:0:0:0:0"
            },
            "expected": 1
        },
        {
            "args": {
                "expression": "T?F?T?9:8:7:6?5:4"
            },
            "expected": 7
        },
        {
            "args": {
                "expression": "F?F?F?F?F?9:8:7:6:5:4"
            },
            "expected": 4
        },
        {
            "args": {
                "expression": "T?2:3"
            },
            "expected": 2
        },
        {
            "args": {
                "expression": "F?F?F?F:1:2:3?4:5?6:7"
            },
            "expected": 7
        },
        {
            "args": {
                "expression": "F?1:T?4:5"
            },
            "expected": 4
        },
        {
            "args": {
                "expression": "T?T?T?T?T?T?T?T?T?0:1:2:3:4:5:6:7:8:9"
            },
            "expected": 0
        },
        {
            "args": {
                "expression": "T?F?F?1:2:T?3:4:F?5:6"
            },
            "expected": 3
        }
    ];
