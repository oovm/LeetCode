// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "board": [["A", "B"], ["C", "D"]],
                "word": "BD"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B"], ["C", "D"]],
                "word": "AC"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "ABCB"
            },
            "expected": false
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "ASADB"
            },
            "expected": false
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "ABCB"
            },
            "expected": false
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "E", "S"], ["A", "D", "E", "E"]],
                "word": "ABCESEEEFS"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "Z"
            },
            "expected": false
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "AB"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "ABCCED"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "SEE"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "E"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "SEE"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B"], ["C", "D"]],
                "word": "AB"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B"], ["C", "D"]],
                "word": "CD"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "ASAD"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A"]],
                "word": "A"
            },
            "expected": true
        },
        {
            "args": {
                "board": [["A", "B", "C", "E"], ["S", "F", "C", "S"], ["A", "D", "E", "E"]],
                "word": "ABCCED"
            },
            "expected": true
        }
    ];
