// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "n": 5,
                "s1": "apple",
                "s2": "zebra",
                "evil": "app"
            },
            "expected": 11220078
        },
        {
            "args": {
                "n": 5,
                "s1": "apple",
                "s2": "appla",
                "evil": "appl"
            },
            "expected": 0
        },
        {
            "args": {
                "n": 3,
                "s1": "aaa",
                "s2": "zzz",
                "evil": "abc"
            },
            "expected": 17575
        },
        {
            "args": {
                "n": 5,
                "s1": "aaaaa",
                "s2": "zzzzz",
                "evil": "abc"
            },
            "expected": 11879348
        },
        {
            "args": {
                "n": 10,
                "s1": "abcdefghij",
                "s2": "abcdefghij",
                "evil": "ghij"
            },
            "expected": 0
        },
        {
            "args": {
                "n": 5,
                "s1": "apple",
                "s2": "zebra",
                "evil": "dog"
            },
            "expected": 11219789
        },
        {
            "args": {
                "n": 2,
                "s1": "gx",
                "s2": "gz",
                "evil": "x"
            },
            "expected": 2
        },
        {
            "args": {
                "n": 3,
                "s1": "abc",
                "s2": "xyz",
                "evil": "def"
            },
            "expected": 16169
        },
        {
            "args": {
                "n": 8,
                "s1": "leetcode",
                "s2": "leetgoes",
                "evil": "leet"
            },
            "expected": 0
        },
        {
            "args": {
                "n": 3,
                "s1": "aaa",
                "s2": "zzz",
                "evil": "xyz"
            },
            "expected": 17575
        },
        {
            "args": {
                "n": 2,
                "s1": "aa",
                "s2": "da",
                "evil": "b"
            },
            "expected": 51
        },
        {
            "args": {
                "n": 3,
                "s1": "abc",
                "s2": "xyz",
                "evil": "de"
            },
            "expected": 16120
        },
        {
            "args": {
                "n": 10,
                "s1": "aaaaaaaaaa",
                "s2": "zzzzzzzzzz",
                "evil": "mnop"
            },
            "expected": 932258852
        },
        {
            "args": {
                "n": 10,
                "s1": "abcdefghij",
                "s2": "zzzzzzzzzz",
                "evil": "mnop"
            },
            "expected": 67339166
        },
        {
            "args": {
                "n": 25,
                "s1": "abcdefghijklmnopqrstuvwxyz",
                "s2": "abcdefghijklmnopqrstuvwxyz",
                "evil": "abcde"
            },
            "expected": 0
        },
        {
            "args": {
                "n": 45,
                "s1": "abcdefghijklmnopqrstuvwxyzabcdefghij",
                "s2": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
                "evil": "mnopqr"
            },
            "expected": 720631236
        },
        {
            "args": {
                "n": 6,
                "s1": "aaaaaa",
                "s2": "zzzzzz",
                "evil": "ab"
            },
            "expected": 306634951
        },
        {
            "args": {
                "n": 20,
                "s1": "aaabaaabaaabaaabaa",
                "s2": "zzzzzzzzzzzzzzzzzzzz",
                "evil": "aaa"
            },
            "expected": 357553640
        },
        {
            "args": {
                "n": 35,
                "s1": "applepieapplepieapplepieapplepie",
                "s2": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
                "evil": "apple"
            },
            "expected": 695022504
        },
        {
            "args": {
                "n": 7,
                "s1": "aaaaaaa",
                "s2": "zzzzzzz",
                "evil": "abc"
            },
            "expected": 29525318
        },
        {
            "args": {
                "n": 20,
                "s1": "abcdabcdabcdabcdabcd",
                "s2": "zzzzzzzzzzzzzzzzzzzz",
                "evil": "zabcd"
            },
            "expected": 426896930
        },
        {
            "args": {
                "n": 10,
                "s1": "abcdefghij",
                "s2": "abcdefghiz",
                "evil": "ghi"
            },
            "expected": 0
        },
        {
            "args": {
                "n": 15,
                "s1": "abcdefghijklnmop",
                "s2": "abcdefghijklnmopqrstuvwxyz",
                "evil": "mnop"
            },
            "expected": 1
        },
        {
            "args": {
                "n": 30,
                "s1": "abcdefghijklmnopqrstuvwxyzabcde",
                "s2": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
                "evil": "vwxyz"
            },
            "expected": 858527385
        },
        {
            "args": {
                "n": 50,
                "s1": "leetcodeleetcodeleetcodeleetcodeleetcode",
                "s2": "leetgoesleetgoesleetgoesleetgoesleetgoes",
                "evil": "leet"
            },
            "expected": 0
        },
        {
            "args": {
                "n": 40,
                "s1": "aaabbbcccdddeeefffggghhhiiijjjkkklllmmmnnnooopppqqqrrrssstttuuuvvvwwwxxxxyyyzzz",
                "s2": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
                "evil": "mnopqr"
            },
            "expected": 438601268
        },
        {
            "args": {
                "n": 10,
                "s1": "abcdefghij",
                "s2": "zjklmnopqr",
                "evil": "mnop"
            },
            "expected": 922212598
        },
        {
            "args": {
                "n": 40,
                "s1": "abcdefghijabcdefghijabcdefghijabcdefghij",
                "s2": "zjklmnopqrzjklmnopqrzjklmnopqrzjklmnopqr",
                "evil": "mnopqr"
            },
            "expected": 54391096
        },
        {
            "args": {
                "n": 5,
                "s1": "aaaaa",
                "s2": "zzzzz",
                "evil": "b"
            },
            "expected": 9765625
        }
    ];
