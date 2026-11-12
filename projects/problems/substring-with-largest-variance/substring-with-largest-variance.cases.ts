// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "zzzzzzy"
            },
            "expected": 5
        },
        {
            "args": {
                "s": "zyzzyzyzy"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "abbaabbaabba"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "abababab"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aaaaa"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "a"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcabcabc"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "zzyzxzyzyzxzyzxzyzxzyzxzyzxzyzxzyz"
            },
            "expected": 11
        },
        {
            "args": {
                "s": "abcabcabcabc"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "abcde"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "leetcode"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "xyzxyzxyz"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "abccccccc"
            },
            "expected": 6
        },
        {
            "args": {
                "s": "zzzzzzzzzz"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "zzzzzyyyyxxxxwwwwvvvvuuuuttttssssrrrrqqqqppppllllkkkkjjjjiiiihhhhggggffffffeee ddcccbbbbaaaa"
            },
            "expected": 5
        },
        {
            "args": {
                "s": "aabbcc"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "mississippi"
            },
            "expected": 3
        },
        {
            "args": {
                "s": "abcdefghij"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijj"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aabbaaabb"
            },
            "expected": 3
        },
        {
            "args": {
                "s": "abacaba"
            },
            "expected": 3
        },
        {
            "args": {
                "s": "aababbb"
            },
            "expected": 3
        }
    ];
