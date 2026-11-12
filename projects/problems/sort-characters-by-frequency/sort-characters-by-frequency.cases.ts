// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "aA"
            },
            "expected": "aA"
        },
        {
            "args": {
                "s": "2a554442f544asf"
            },
            "expected": "4444455522aaffs"
        },
        {
            "args": {
                "s": "2a554442f544asfasss"
            },
            "expected": "44444ssssaaa55522ff"
        },
        {
            "args": {
                "s": "zzzzZZZZ"
            },
            "expected": "zzzzZZZZ"
        },
        {
            "args": {
                "s": "bbaaccdd"
            },
            "expected": "bbaaccdd"
        },
        {
            "args": {
                "s": "1223334444"
            },
            "expected": "4444333221"
        },
        {
            "args": {
                "s": "cccaaa"
            },
            "expected": "cccaaa"
        },
        {
            "args": {
                "s": "tree"
            },
            "expected": "eetr"
        },
        {
            "args": {
                "s": "aAaaaAaA"
            },
            "expected": "aaaaaAAA"
        },
        {
            "args": {
                "s": "a"
            },
            "expected": "a"
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
            },
            "expected": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
        },
        {
            "args": {
                "s": ""
            },
            "expected": ""
        },
        {
            "args": {
                "s": "aAaaaAaaAAaAa"
            },
            "expected": "aaaaaaaaAAAAA"
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
            },
            "expected": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
        },
        {
            "args": {
                "s": "aAaaaAaaAA"
            },
            "expected": "aaaaaaAAAA"
        },
        {
            "args": {
                "s": "Aabb"
            },
            "expected": "bbAa"
        },
        {
            "args": {
                "s": "1234567890"
            },
            "expected": "1234567890"
        },
        {
            "args": {
                "s": "bbaacc"
            },
            "expected": "bbaacc"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": "iiiaabbccddeeffgghhjjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
        },
        {
            "args": {
                "s": "aaaabbbbccccddddeeeeffffgggghhhhiiiiiiijjjjjjjjjkkkkkkkkkkllllllllllllmmmmmmmmmmmmm"
            },
            "expected": "mmmmmmmmmmmmmllllllllllllkkkkkkkkkkjjjjjjjjjiiiiiiiaaaabbbbccccddddeeeeffffgggghhhh"
        },
        {
            "args": {
                "s": "abcdefghijklmnopqrstuvwxyz"
            },
            "expected": "abcdefghijklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
            },
            "expected": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiiijjkkllmmnnooppqqrrssttuuvvwwxxyyzzAA"
            },
            "expected": "iiiaabbccddeeffgghhjjkkllmmnnooppqqrrssttuuvvwwxxyyzzAA"
        },
        {
            "args": {
                "s": "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
            },
            "expected": "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
        },
        {
            "args": {
                "s": "a1b2c3d4e5f6g7h8i9j0a1b2c3d4e5f6g7h8i9j0a1b2c3d4e5f6g7h8i9j0"
            },
            "expected": "aaa111bbb222ccc333ddd444eee555fff666ggg777hhh888iii999jjj000"
        },
        {
            "args": {
                "s": "eLeetCoDe"
            },
            "expected": "eeeeLtCoD"
        },
        {
            "args": {
                "s": "!!!!!!@@@@@@########$$$$$$$&&&&&&&&&&(((((()))))))"
            },
            "expected": "&&&&&&&&&&########$$$$$$$)))))))!!!!!!@@@@@@(((((("
        },
        {
            "args": {
                "s": "112233445566778899001122334455"
            },
            "expected": "111122223333444455556677889900"
        },
        {
            "args": {
                "s": "abcABC123abcABC123abcABC"
            },
            "expected": "aaabbbcccAAABBBCCC112233"
        },
        {
            "args": {
                "s": "anagram"
            },
            "expected": "aaangrm"
        },
        {
            "args": {
                "s": "a1b2c3d4e5f6g7h8i9j0A1B2C3D4E5F6G7H8I9J0"
            },
            "expected": "11223344556677889900abcdefghijABCDEFGHIJ"
        },
        {
            "args": {
                "s": "frequencysorttestcase"
            },
            "expected": "eeeessstttrrccfqunyoa"
        },
        {
            "args": {
                "s": "frequencySort"
            },
            "expected": "rreefquncySot"
        },
        {
            "args": {
                "s": "aaaaaaaaaabbccccdddd"
            },
            "expected": "aaaaaaaaaaccccddddbb"
        },
        {
            "args": {
                "s": "leetcode"
            },
            "expected": "eeeltcod"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzzAABBCCDDEEFFGGHHIİJKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZ"
            },
            "expected": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzzAABBCCDDEEFFGGHHKKLLMMNNOOPPQQRRSSTTUUVVWWXXYYZZIİJ"
        },
        {
            "args": {
                "s": "thisisaverylongtestcasewithmixedcharacters1234567890!@#$%^&*()"
            },
            "expected": "tttttssssseeeeeiiiiaaaahhhrrrcccvylongwmxd1234567890!@#$%^&*()"
        },
        {
            "args": {
                "s": "ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKkJjIiHhGgFfEeDdCcBbAa1234567890"
            },
            "expected": "ZzYyXxWwVvUuTtSsRrQqPpOoNnMmLlKkJjIiHhGgFfEeDdCcBbAa1234567890"
        },
        {
            "args": {
                "s": "abcABC123xyzXYZ!@#"
            },
            "expected": "abcABC123xyzXYZ!@#"
        },
        {
            "args": {
                "s": "01233210"
            },
            "expected": "00112233"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiiijjkkllmmnnooppqqrrssttuuvvwwxxyyzzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            },
            "expected": "iiiaabbccddeeffgghhjjkkllmmnnooppqqrrssttuuvvwwxxyyzzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        },
        {
            "args": {
                "s": "111222333444555666777888999000"
            },
            "expected": "111222333444555666777888999000"
        },
        {
            "args": {
                "s": "repeatedcharactersaretestedhere"
            },
            "expected": "eeeeeeeeerrrrraaaattttddcchhssp"
        },
        {
            "args": {
                "s": "aaAAbbBBccCCddDDeeEEffFFggGGhhHHiiIIjjJJkkKKllLLmmMMnnNNooppQQrrSSttUUvvWWxxYYzzZZ"
            },
            "expected": "aaAAbbBBccCCddDDeeEEffFFggGGhhHHiiIIjjJJkkKKllLLmmMMnnNNooppQQrrSSttUUvvWWxxYYzzZZ"
        },
        {
            "args": {
                "s": "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
            },
            "expected": "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        },
        {
            "args": {
                "s": "mississippi"
            },
            "expected": "iiiissssppm"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz1234567890"
            },
            "expected": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz1234567890"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz1234567890"
            },
            "expected": "iiiaabbccddeeffgghhjjkkllmmnnooppqqrrssttuuvvwwxxyyzz1234567890"
        },
        {
            "args": {
                "s": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
            },
            "expected": "aabbccddeeffgghhiijjkkllmmnnooppqqrrssttuuvvwwxxyyzz"
        },
        {
            "args": {
                "s": "Mississippi"
            },
            "expected": "iiiissssppM"
        },
        {
            "args": {
                "s": "aAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaA"
            },
            "expected": "aaaaaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAA"
        },
        {
            "args": {
                "s": "123456789012345678901234567890"
            },
            "expected": "111222333444555666777888999000"
        },
        {
            "args": {
                "s": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
            },
            "expected": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
        },
        {
            "args": {
                "s": "zyxwvutsrqponmlkjihgfedcba"
            },
            "expected": "zyxwvutsrqponmlkjihgfedcba"
        }
    ];
