// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "7777777777777777"
            },
            "expected": false
        },
        {
            "args": {
                "s": "666666666666666"
            },
            "expected": false
        },
        {
            "args": {
                "s": "111111"
            },
            "expected": false
        },
        {
            "args": {
                "s": "999999999999999999"
            },
            "expected": false
        },
        {
            "args": {
                "s": "55555555555555"
            },
            "expected": true
        },
        {
            "args": {
                "s": "00011111222"
            },
            "expected": true
        },
        {
            "args": {
                "s": "11"
            },
            "expected": true
        },
        {
            "args": {
                "s": "3333333333"
            },
            "expected": false
        },
        {
            "args": {
                "s": "011100022233"
            },
            "expected": false
        },
        {
            "args": {
                "s": "000111000"
            },
            "expected": false
        },
        {
            "args": {
                "s": "88888888888888888"
            },
            "expected": true
        },
        {
            "args": {
                "s": "22222222"
            },
            "expected": true
        },
        {
            "args": {
                "s": "444444444444"
            },
            "expected": false
        },
        {
            "args": {
                "s": "122111"
            },
            "expected": false
        }
    ];
