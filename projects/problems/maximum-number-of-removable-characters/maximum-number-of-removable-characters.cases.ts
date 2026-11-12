// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "pqrstu",
                "p": "psu",
                "removable": [5, 4, 3, 2, 1, 0]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdefghij",
                "p": "acegi",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "deeddeede",
                "p": "dee",
                "removable": [5, 3, 4, 6]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "deeedbbcccbdaa",
                "p": "ddccbb",
                "removable": [8, 2, 3, 0, 7]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz",
                "p": "acegikmoqsuwy",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]
            },
            "expected": 13
        },
        {
            "args": {
                "s": "zzzzzzzzzz",
                "p": "zz",
                "removable": [1, 3, 5, 7]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "aaaabbbb",
                "p": "ab",
                "removable": [2, 3, 4, 5]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "abcdef",
                "p": "abc",
                "removable": [5, 4, 3, 2, 1, 0]
            },
            "expected": 3
        },
        {
            "args": {
                "s": "aabcbcb",
                "p": "abc",
                "removable": [3, 1, 0, 4]
            },
            "expected": 2
        },
        {
            "args": {
                "s": "abcdxyz",
                "p": "ad",
                "removable": [0, 1, 2, 3, 4, 5, 6]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcacb",
                "p": "ab",
                "removable": [3, 1, 0]
            },
            "expected": 2
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz",
                "p": "acegikmoqsuwy",
                "removable": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "ababababab",
                "p": "aaaa",
                "removable": [0, 2, 4, 6, 8]
            },
            "expected": 1
        },
        {
            "args": {
                "s": "mississippi",
                "p": "issi",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "zpqom",
                "p": "z",
                "removable": [0, 1, 2, 3, 4]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcab",
                "p": "abc",
                "removable": [0, 1, 2, 3, 4]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "xyz",
                "p": "xyz",
                "removable": [0, 1, 2]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdef",
                "p": "af",
                "removable": [1, 2, 3, 4]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "abcbddddd",
                "p": "abcd",
                "removable": [3, 2, 1, 4, 5, 6]
            },
            "expected": 1
        },
        {
            "args": {
                "s": "zazbzczdzezfzgzhzi",
                "p": "abcdefg",
                "removable": [0, 2, 4, 6, 8, 10, 12, 14, 16]
            },
            "expected": 9
        },
        {
            "args": {
                "s": "pythonprogramming",
                "p": "ppn",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "thisisaverylongstringthatweneedtoremovesomecharactersfrom",
                "p": "thisisalong",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "mississippi",
                "p": "miss",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "onetwothreefourfivesixseveneightnine",
                "p": "onefivesix",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdefghijklnmopqrstuvwxyz",
                "p": "zyxwvutsrqponmlkjihgfedcba",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abracadabra",
                "p": "aca",
                "removable": [1, 3, 5, 7, 9, 10]
            },
            "expected": 5
        },
        {
            "args": {
                "s": "leetcodeleetcodeleetcode",
                "p": "leetcode",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
            },
            "expected": 16
        },
        {
            "args": {
                "s": "qwertyuiopasdfghjklzxcvbnm",
                "p": "qwerty",
                "removable": [0, 1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 30, 31, 32, 33, 34, 35]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
                "p": "zzzz",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
            },
            "expected": 30
        },
        {
            "args": {
                "s": "abracadabra",
                "p": "aa",
                "removable": [0, 2, 4, 6, 8, 10]
            },
            "expected": 6
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
                "p": "zzz",
                "removable": [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
                    33, 34, 35, 36, 37, 38, 39
                ]
            },
            "expected": 29
        },
        {
            "args": {
                "s": "abacabadabacaba",
                "p": "abc",
                "removable": [2, 5, 8, 11, 14]
            },
            "expected": 5
        },
        {
            "args": {
                "s": "abcdefghijklm",
                "p": "abc",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "zzzzzzzzzz",
                "p": "zz",
                "removable": [1, 3, 5, 7, 9]
            },
            "expected": 5
        },
        {
            "args": {
                "s": "thequickbrownfoxjumpsoverthelazydog",
                "p": "quickbrownfox",
                "removable": [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
                    33, 34, 35, 36, 37, 38, 39, 40
                ]
            },
            "expected": 3
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
                "p": "abcdefghijklmnopqrstuvwxyz",
                "removable": [
                    50, 49, 48, 47, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20,
                    19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
                ]
            },
            "expected": 2
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzz",
                "p": "zzzzz",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
            },
            "expected": 15
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz",
                "p": "az",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdeffedcba",
                "p": "abcdef",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "mississippi",
                "p": "issi",
                "removable": [2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            "expected": 3
        },
        {
            "args": {
                "s": "abcdefghijklmno",
                "p": "def",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            },
            "expected": 3
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzz",
                "p": "zzzz",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
            },
            "expected": 16
        },
        {
            "args": {
                "s": "pneumonoultramicroscopicsilicovolcanoconiosis",
                "p": "pus",
                "removable": [
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
                    34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47
                ]
            },
            "expected": 7
        },
        {
            "args": {
                "s": "aaaaaaabbbbbbb",
                "p": "aabbb",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
            },
            "expected": 5
        },
        {
            "args": {
                "s": "abcdefghijklmnop",
                "p": "mnop",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
            },
            "expected": 12
        },
        {
            "args": {
                "s": "xyxzyzyzyxzyzyzyx",
                "p": "xyz",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            "expected": 9
        },
        {
            "args": {
                "s": "banana",
                "p": "ban",
                "removable": [0, 2, 4]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "aaaabbbbccccdddd",
                "p": "abcd",
                "removable": [3, 7, 11, 15]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "abracadabra",
                "p": "aca",
                "removable": [1, 3, 5, 7, 9]
            },
            "expected": 5
        },
        {
            "args": {
                "s": "banana",
                "p": "ban",
                "removable": [0, 1, 2, 3, 4, 5]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdefffffghijklmnopqrstuvwxyz",
                "p": "acegikmoqsuwy",
                "removable": [
                    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 20, 20, 20,
                    20, 20, 20, 20, 20, 20, 20
                ]
            },
            "expected": 10
        },
        {
            "args": {
                "s": "aabbccddeeffgghhii",
                "p": "abcdefghi",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17]
            },
            "expected": 9
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
                "p": "abcdefghijklmnopqrstuvwxzy",
                "removable": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdabcdabcd",
                "p": "abc",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            },
            "expected": 8
        },
        {
            "args": {
                "s": "thisisateststring",
                "p": "tst",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 20, 21, 22, 23, 24]
            },
            "expected": 5
        },
        {
            "args": {
                "s": "qwertyuiopasdfghjklzxcvbnm",
                "p": "qz",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcabcabcabcabc",
                "p": "abcabcabc",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "xyzzxyzzxyzz",
                "p": "xyz",
                "removable": [0, 2, 4, 6, 8, 10]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz",
                "p": "abcdefghijklmnopqrstuvwxyz",
                "removable": [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
                    33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59
                ]
            },
            "expected": 1
        },
        {
            "args": {
                "s": "aaaaaaaaaaa",
                "p": "aaaaa",
                "removable": [1, 3, 5, 7, 9]
            },
            "expected": 5
        },
        {
            "args": {
                "s": "abcdabcdabcdabcdabcdabcd",
                "p": "abcd",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
            },
            "expected": 20
        },
        {
            "args": {
                "s": "abababababababababab",
                "p": "aabbaabb",
                "removable": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "hellohellohellohello",
                "p": "heo",
                "removable": [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
                    33, 34, 35
                ]
            },
            "expected": 15
        },
        {
            "args": {
                "s": "xyzzxyzzxyzz",
                "p": "xyz",
                "removable": [1, 3, 5, 7, 9, 11]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "mississippi",
                "p": "issi",
                "removable": [3, 1, 0, 4, 5, 2, 6, 7, 8, 9, 10]
            },
            "expected": 3
        },
        {
            "args": {
                "s": "abracadabra",
                "p": "ac",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            "expected": 3
        },
        {
            "args": {
                "s": "bcaabcbabcabc",
                "p": "abc",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
            },
            "expected": 10
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzz",
                "p": "zzz",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
            },
            "expected": 10
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz",
                "p": "bdfhjlnprtvxz",
                "removable": [1, 5, 9, 13, 17, 21, 25]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdeffedcba",
                "p": "abcdef",
                "removable": [0, 2, 4, 6, 8, 10]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "findinganagrams",
                "p": "anag",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17]
            },
            "expected": 3
        },
        {
            "args": {
                "s": "mississippi",
                "p": "miss",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz",
                "p": "adgjmpsvy",
                "removable": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "hellotherehowareyou",
                "p": "heoy",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "xyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz",
                "p": "xyz",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "aaaaabbbbbcccc",
                "p": "abc",
                "removable": [5, 6, 7, 8, 9, 10]
            },
            "expected": 4
        },
        {
            "args": {
                "s": "pneumonoultramicroscopicsilicovolcanoconiosis",
                "p": "pneumo",
                "removable": [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "thisisaverylongstring",
                "p": "tils",
                "removable": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            },
            "expected": 3
        },
        {
            "args": {
                "s": "leetcodeleetcodeleetcodeleetcode",
                "p": "leetcodelt",
                "removable": [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
                ]
            },
            "expected": 16
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz",
                "p": "acegikmoqsuwy",
                "removable": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23]
            },
            "expected": 12
        },
        {
            "args": {
                "s": "abcdefghijabcdefghij",
                "p": "acegik",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
            },
            "expected": 0
        },
        {
            "args": {
                "s": "nnnnoooooommmm",
                "p": "nom",
                "removable": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
            },
            "expected": 3
        }
    ];
