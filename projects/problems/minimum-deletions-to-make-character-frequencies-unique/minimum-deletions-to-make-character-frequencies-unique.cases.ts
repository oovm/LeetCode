// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "aab"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "aabacabadabaeabafabagabahabaiabajabakabalabamabanabaoabapabaqabarabasabataabuabavabawabaxabayabajabaz"
            },
            "expected": 22
        },
        {
            "args": {
                "s": "abcabcabc"
            },
            "expected": 3
        },
        {
            "args": {
                "s": "aabbbcccddddeeeeeffffffggggggghhhhhhhhiiiiiiiii"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "zzzzzzzzzz"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyzz"
            },
            "expected": 24
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz"
            },
            "expected": 25
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": 49
        },
        {
            "args": {
                "s": "ceabaacb"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "aaabbbcc"
            },
            "expected": 2
        },
        {
            "args": {
                "s": "aabbccddeeffgghhii"
            },
            "expected": 15
        },
        {
            "args": {
                "s": "zyxwvutsrqponmlkjihgfedcba"
            },
            "expected": 25
        },
        {
            "args": {
                "s": "a"
            },
            "expected": 0
        },
        {
            "args": {
                "s": "zzzzzzzzzzyyyyyyyyyxxxxxxxwwwwwwvvvvuuuuutttttsssssrrrrqqqqppppooooonnnnmmmmlllkkkjjjiii"
            },
            "expected": 41
        },
        {
            "args": {
                "s": "aabbccddeeefffggg"
            },
            "expected": 11
        },
        {
            "args": {
                "s": "aabbccddeeefffhhhiiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": 48
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzzzzzzzzzz"
            },
            "expected": 47
        },
        {
            "args": {
                "s": "pppppppppooooooonnnnnmmmllllllkkkkjjjjiiiiiiiihhhhhhhggggggg"
            },
            "expected": 15
        },
        {
            "args": {
                "s": "aabbbccccddddeeeee"
            },
            "expected": 3
        },
        {
            "args": {
                "s": "abababababababababab"
            },
            "expected": 1
        },
        {
            "args": {
                "s": "zzzzzzzzzzzyyyyyyyxxxxxxxwwwwwwvvvvuuuutttssrrqponmlkjihgfedcba"
            },
            "expected": 24
        },
        {
            "args": {
                "s": "aabbbcccddddeeeeeffffffggggggghhhhhhhhiiiiiiiiijjjjjjjjjj"
            },
            "expected": 2
        }
    ];
