// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "zzzzzzzzz"
            },
            "expected": 7
        },
        {
            "args": {
                "s": "aaabbbccc"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aabbbcccaaa"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "abcdef"
            },
            "expected": -1
        },
        {
            "args": {
                "s": "abacabadabacaba"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "abcabcabc"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "abcaba"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aaaaabbbbccccc"
            },
            "expected": 3
        },
        {
            "args": {
                "s": "aabbaabbcc"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aaaaaaaaaa"
            },
            "expected": 8
        },
        {
            "args": {
                "s": "aaaabbbbcccc"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "abababababa"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "abcdabcabcd"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aabbccddeeefff"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aabbccddeeffgg"
            },
            "expected": -1
        },
        {
            "args": {
                "s": "aaaa"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "aaabaaa"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "aaaaabbbbbaaaa"
            },
            "expected": 4
        },
        {
            "args": {
                "s": "nnnhaaaannn"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "zzzzz"
            },
            "expected": 3
        },
        {
            "args": {
                "s": "aabbaabbccddccddc"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": -1
        }
    ];
