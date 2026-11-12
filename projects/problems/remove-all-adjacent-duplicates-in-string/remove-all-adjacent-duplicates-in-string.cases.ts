// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz"
            },
            "expected": "abcdefghijklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "acbbcaa"
            },
            "expected": "a"
        },
        {
            "args": {
                "s": "aabbaa"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "abcdef"
            },
            "expected": "abcdef"
        },
        {
            "args": {
                "s": "abbacdcd"
            },
            "expected": "cdcd"
        },
        {
            "args": {
                "s": "aaaaa"
            },
            "expected": "a"
        },
        {
            "args": {
                "s": "abbaca"
            },
            "expected": "ca"
        },
        {
            "args": {
                "s": "a"
            },
            "expected": "a"
        },
        {
            "args": {
                "s": "aabbccddccbaaabbccdd"
            },
            "expected": "ba"
        },
        {
            "args": {
                "s": ""
            },
            "expected": ""
        },
        {
            "args": {
                "s": "abcddcba"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "abba"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "zyz"
            },
            "expected": "zyz"
        },
        {
            "args": {
                "s": "abc"
            },
            "expected": "abc"
        },
        {
            "args": {
                "s": "abbacca"
            },
            "expected": "a"
        },
        {
            "args": {
                "s": "abcd"
            },
            "expected": "abcd"
        },
        {
            "args": {
                "s": "abbazzyy"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "aabbccddeeff"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "aabbcc"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "mississippi"
            },
            "expected": "m"
        },
        {
            "args": {
                "s": "aaaaaaaaa"
            },
            "expected": "a"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "aaaaaaaa"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "zzzyyxxwwvvuuttrrqqqllopssmmnnllkkjjiihhggffeeddccbbaa"
            },
            "expected": "zqop"
        },
        {
            "args": {
                "s": "aabbccdd"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "azxxzy"
            },
            "expected": "ay"
        },
        {
            "args": {
                "s": "aabbbccddeeeffggghhhiiiijjjjkkkkllllmmmmnnnnooopppqqqqrrrrssssttttuuuuvvvvwwwwwxxxxxyyyyyzzzzz"
            },
            "expected": "beghopwxyz"
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyzzyxwvutsrqponmlkjihgfedcba"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "abcdeedcba"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "abcabcabcabcabcabcabcabcabcabc"
            },
            "expected": "abcabcabcabcabcabcabcabcabcabc"
        },
        {
            "args": {
                "s": "abcdabcdbcaabbccdd"
            },
            "expected": "abcdabcdbc"
        },
        {
            "args": {
                "s": "xyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyx"
            },
            "expected": "xyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyxzyzyx"
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"
            },
            "expected": "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "aabbaaabbbaaaabbbaaaaabbbbbbaaaaaaaaa"
            },
            "expected": "a"
        },
        {
            "args": {
                "s": "mississiissippi"
            },
            "expected": "m"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzzzyxwvutsrqponmlkjihgfedcba"
            },
            "expected": "zyxwvutsrqponmlkjihgfedcba"
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcba"
            },
            "expected": "abcdefghijklmnopqrstuvwxyzyxwvutsrqponmlkjihgfedcba"
        },
        {
            "args": {
                "s": "aaaabbbbccccddddeeeeffffgggghhhhiiiijjjjkkkkllllmmmmnnnnooooppppqqqqrrrrssssttttuuuuvvvvwwwwxxxxyyyyzzzz"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "aaabbbcccdddcccbbbaaa"
            },
            "expected": "abcdcba"
        },
        {
            "args": {
                "s": "abccbaabccbaabccbaabccbaabccbaabccbaabccbaabccba"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            },
            "expected": ""
        },
        {
            "args": {
                "s": "abacadaeafagahaiajakalamananapapaqara saratasaunaavawaxayaz"
            },
            "expected": "abacadaeafagahaiajakalamananapapaqara saratasaunvawaxayaz"
        }
    ];
