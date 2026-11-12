// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "parent": [-1, 0, 1, 2, 2],
                "s": "abcba"
            },
            "expected": [false, false, false, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 2],
                "s": "aaaab"
            },
            "expected": [true, true, false, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 2],
                "s": "aabbcc"
            },
            "expected": [false, false, false, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 2, 2],
                "s": "ababa"
            },
            "expected": [false, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 0, 0, 0, 0],
                "s": "aaaaaaa"
            },
            "expected": [true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 0, 1, 1],
                "s": "abcabc"
            },
            "expected": [false, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 0, 2],
                "s": "abaca"
            },
            "expected": [false, false, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2],
                "s": "aababa"
            },
            "expected": [true, true, false, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 2, 2],
                "s": "abcde"
            },
            "expected": [false, false, false, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 0, 0],
                "s": "aabcb"
            },
            "expected": [true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1],
                "s": "aa"
            },
            "expected": [true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 2],
                "s": "abcd"
            },
            "expected": [false, false, false, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 2, 3],
                "s": "abcde"
            },
            "expected": [false, false, false, false, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 2, 3, 4],
                "s": "aaaaa"
            },
            "expected": [true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12],
                "s": "abcdexyzzyxdcba"
            },
            "expected": [false, false, false, false, false, false, false, false, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
                "s": "aabbccccbbdd"
            },
            "expected": [false, false, false, false, false, false, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9],
                "s": "abcdefghijihgfedcba"
            },
            "expected": [
                false,
                false,
                false,
                false,
                false,
                false,
                true,
                false,
                false,
                false,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4],
                "s": "aabacbacb"
            },
            "expected": [false, false, true, false, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                "s": "abcdefghgfedcba"
            },
            "expected": [false, false, false, false, false, true, false, false, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9],
                "s": "aaaaaaaaaaaaaaaaaaaa"
            },
            "expected": [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11],
                "s": "aabbccddeeffgghhii"
            },
            "expected": [false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
                "s": "aabbccddeeffgghhii"
            },
            "expected": [false, false, false, false, false, false, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [
                    -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ],
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": [
                false,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3],
                "s": "aaaaaaaaaa"
            },
            "expected": [true, true, true, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [
                    -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16
                ],
                "s": "abacabadabacabadabacabadabacabad"
            },
            "expected": [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
                "s": "abacabadabacabad"
            },
            "expected": [false, true, false, true, true, true, true, true, true, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
                "s": "aabbccddeeff"
            },
            "expected": [false, false, false, false, false, false, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
                "s": "abcdefghijjihgfedcba"
            },
            "expected": [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
                "s": "abccbaabccba"
            },
            "expected": [false, false, false, false, false, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8],
                "s": "zzzzzzzzz"
            },
            "expected": [true, true, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
                "s": "abcdefghihgfedcba"
            },
            "expected": [false, false, false, false, false, true, false, false, true, true, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8],
                "s": "abacabadabacaba"
            },
            "expected": [false, false, false, false, true, false, true, false, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                "s": "abcdefghij"
            },
            "expected": [false, true, true, true, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 2, 2, 3, 3, 4, 4, 5, 5],
                "s": "abcdefghijab"
            },
            "expected": [false, false, false, false, false, false, true, true, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 2, 1, 3, 4],
                "s": "abcdefg"
            },
            "expected": [false, false, false, false, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5],
                "s": "aaabbbccc"
            },
            "expected": [false, false, false, false, false, true, true, true, true]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                "s": "abcdeedcba"
            },
            "expected": [true, false, false, false, false, false, false, false, true, true]
        },
        {
            "args": {
                "parent": [
                    -1, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17,
                    17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24
                ],
                "s": "abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcba"
            },
            "expected": [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ]
        },
        {
            "args": {
                "parent": [-1, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7],
                "s": "abababababababababababab"
            },
            "expected": [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true
            ]
        }
    ];
