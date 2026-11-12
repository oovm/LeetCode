// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "abbcdecbba",
                "queries": [[0, 2, 7, 9]]
            },
            "expected": [false]
        },
        {
            "args": {
                "s": "abcabc",
                "queries": [[1, 1, 3, 5], [0, 2, 5, 5]]
            },
            "expected": [true, true]
        },
        {
            "args": {
                "s": "abcdefgfedcba",
                "queries": [[1, 2, 11, 12], [3, 4, 8, 9]]
            },
            "expected": [true, true]
        },
        {
            "args": {
                "s": "acbcab",
                "queries": [[1, 2, 4, 5]]
            },
            "expected": [true]
        },
        {
            "args": {
                "s": "aabbaa",
                "queries": [[0, 2, 3, 5]]
            },
            "expected": [true]
        },
        {
            "args": {
                "s": "abcdedcba",
                "queries": [[0, 1, 7, 8], [2, 3, 5, 6]]
            },
            "expected": [true, true]
        },
        {
            "args": {
                "s": "aabbccdd",
                "queries": [[0, 1, 6, 7], [2, 3, 4, 5]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
                "queries": [[0, 19, 38, 57], [1, 18, 39, 56], [2, 17, 40, 55]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "abcdexyzwvutsrqponmlkjihgfedcbazyxwvutsrqponmlkjihgfedcba",
                "queries": [[0, 1, 38, 39], [2, 3, 36, 37], [4, 5, 34, 35]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
                "queries": [[0, 9, 32, 41], [1, 5, 28, 37], [2, 7, 25, 34]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "racecaracercar",
                "queries": [[0, 2, 10, 12], [3, 5, 8, 10], [1, 4, 7, 9]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "abacaxbaxaba",
                "queries": [[0, 1, 9, 10], [2, 3, 7, 8], [4, 5, 5, 6]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "abacabadabacaba",
                "queries": [[0, 4, 11, 15], [1, 3, 12, 14], [2, 2, 13, 13]]
            },
            "expected": [true, true, true]
        },
        {
            "args": {
                "s": "aabbccddeeffgg",
                "queries": [[0, 5, 7, 12], [2, 3, 10, 11]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "mississippiissippi",
                "queries": [[0, 4, 10, 14], [1, 3, 11, 13]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "abcdefghijhgfedcba",
                "queries": [[0, 4, 14, 18], [1, 3, 15, 17], [2, 2, 16, 16]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
                "queries": [[0, 11, 34, 45], [12, 22, 23, 33]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "mississippiissippi",
                "queries": [[0, 4, 10, 14], [2, 6, 8, 12]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "abacabadabacaba",
                "queries": [[0, 6, 11, 17], [1, 5, 12, 16], [2, 4, 13, 15]]
            },
            "expected": [true, true, true]
        },
        {
            "args": {
                "s": "xyzyxzyzyxzyzyxzyz",
                "queries": [[0, 3, 9, 12], [4, 7, 13, 16], [1, 2, 17, 18]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "aaaabbbbccccdddd",
                "queries": [[0, 3, 12, 15], [1, 2, 13, 14], [2, 3, 14, 15]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "racecarannakayak",
                "queries": [[0, 6, 8, 13], [1, 5, 9, 12]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "noonnoon",
                "queries": [[0, 2, 5, 7], [1, 3, 4, 6]]
            },
            "expected": [true, true]
        },
        {
            "args": {
                "s": "abcdeedcba",
                "queries": [[0, 4, 5, 9], [1, 3, 6, 8], [2, 2, 7, 7]]
            },
            "expected": [true, true, true]
        },
        {
            "args": {
                "s": "xyzxyzxyzxyzxyzxyzxyzxyzxyzxyz",
                "queries": [[0, 3, 15, 18], [1, 4, 14, 17], [2, 5, 13, 16], [3, 6, 12, 15], [4, 7, 11, 14]]
            },
            "expected": [false, false, false, false, false]
        },
        {
            "args": {
                "s": "mississippiissippi",
                "queries": [[0, 2, 9, 11], [1, 3, 8, 10], [2, 4, 7, 9]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "rotorrotorrotorrotor",
                "queries": [[0, 4, 12, 16], [2, 5, 10, 14], [3, 6, 11, 15]]
            },
            "expected": [true, true, true]
        },
        {
            "args": {
                "s": "abacabadabacabad",
                "queries": [[0, 7, 8, 15], [1, 6, 9, 14], [2, 5, 10, 13], [3, 4, 11, 12]]
            },
            "expected": [true, false, false, false]
        },
        {
            "args": {
                "s": "abcdefghijzyxwvutsrqponmlkjihgfedcba",
                "queries": [[0, 9, 20, 29], [1, 8, 21, 28], [2, 7, 22, 27], [3, 6, 23, 26], [4, 5, 24, 25]]
            },
            "expected": [false, false, false, false, false]
        },
        {
            "args": {
                "s": "rotorrotor",
                "queries": [[0, 2, 6, 8], [1, 4, 5, 7]]
            },
            "expected": [true, true]
        },
        {
            "args": {
                "s": "thisisanoddlengthstring",
                "queries": [[0, 4, 14, 19]]
            },
            "expected": [false]
        },
        {
            "args": {
                "s": "aabbccddeeff",
                "queries": [[0, 2, 9, 11], [1, 3, 8, 10], [2, 4, 7, 9]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "mississippiissim",
                "queries": [[0, 3, 11, 14], [2, 4, 9, 12], [1, 5, 8, 11]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "abacabadabacabad",
                "queries": [[0, 3, 8, 11], [1, 2, 6, 7], [4, 5, 12, 13]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "mississippi",
                "queries": [[1, 2, 7, 8], [0, 1, 10, 11], [3, 4, 6, 7]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "abcdedcbaa",
                "queries": [[0, 1, 8, 9], [2, 3, 6, 7], [1, 4, 5, 8]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "zzzzzzzzzz",
                "queries": [[0, 4, 5, 9], [1, 3, 6, 8], [2, 2, 7, 7]]
            },
            "expected": [true, true, true]
        },
        {
            "args": {
                "s": "abcabcabcabcabcabcabcabcabcabc",
                "queries": [[0, 1, 28, 29], [1, 2, 27, 28], [2, 3, 26, 27], [3, 4, 25, 26], [4, 5, 24, 25], [5, 6, 23, 24]]
            },
            "expected": [false, false, false, false, false, false]
        },
        {
            "args": {
                "s": "abacabadabacabad",
                "queries": [[0, 3, 8, 11], [1, 4, 9, 12], [2, 5, 10, 13]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "aaabbbcccdddeeefffggg",
                "queries": [[0, 4, 11, 15], [1, 2, 9, 10]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "racecarannakayak",
                "queries": [[0, 2, 9, 11], [1, 3, 8, 10], [2, 4, 7, 9]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
                "queries": [[0, 5, 26, 31], [6, 10, 22, 26], [11, 15, 17, 21]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "noonnoon",
                "queries": [[0, 1, 5, 6], [2, 3, 4, 5]]
            },
            "expected": [true, true]
        },
        {
            "args": {
                "s": "zyxzyxzyxzyx",
                "queries": [[0, 2, 9, 11], [3, 5, 6, 8]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "abcabcabcabcabcabcabcabc",
                "queries": [[0, 5, 21, 26], [6, 11, 15, 20], [12, 17, 9, 14]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "noonnoonnoon",
                "queries": [[1, 3, 9, 11], [2, 4, 8, 10], [0, 2, 6, 8]]
            },
            "expected": [true, true, true]
        },
        {
            "args": {
                "s": "abacaxabacax",
                "queries": [[0, 2, 8, 10], [1, 3, 6, 8]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "abcdefghijkzyxwvutsrqponml",
                "queries": [[0, 4, 19, 23], [2, 3, 17, 18]]
            },
            "expected": [false, false]
        },
        {
            "args": {
                "s": "noonnoonnoonnoon",
                "queries": [[0, 3, 12, 15], [1, 2, 13, 14]]
            },
            "expected": [true, true]
        },
        {
            "args": {
                "s": "xyzzyxzyxzyx",
                "queries": [[0, 1, 10, 11], [2, 3, 8, 9], [4, 5, 6, 7]]
            },
            "expected": [false, false, false]
        },
        {
            "args": {
                "s": "abacabadabacaba",
                "queries": [[0, 2, 9, 11], [1, 3, 10, 12], [2, 4, 8, 10]]
            },
            "expected": [true, true, true]
        }
    ];
