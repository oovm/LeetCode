// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7]
            },
            "expected": "1(2(4)(5))(3(6)(7))"
        },
        {
            "args": {
                "root": [1, 2, 3, 4]
            },
            "expected": "1(2(4))(3)"
        },
        {
            "args": {
                "root": [1, 2]
            },
            "expected": "1(2)"
        },
        {
            "args": {
                "root": [1]
            },
            "expected": 1
        },
        {
            "args": {
                "root": [0, -1, 1, -2, 2, -3, 3, -4, 4]
            },
            "expected": "0(-1(-2(-4)(4))(2))(1(-3)(3))"
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            },
            "expected": "1(2(4(8)(9))(5(10)(11)))(3(6(12)(13))(7(14)(15)))"
        },
        {
            "args": {
                "root": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            },
            "expected": "1(2(4(8(16)(17))(9(18)(19)))(5(10(20)(21))(11(22)(23))))(3(6(12(24)(25))(13))(7(14)(15)))"
        }
    ];
