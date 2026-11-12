// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "11#11#11#11#11#11#11#11#11#11#"
            },
            "expected": "kkkkkkkkkk"
        },
        {
            "args": {
                "s": "12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"
            },
            "expected": "abcdefghijklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "26#25#24#23#22#21#"
            },
            "expected": "zyxwvu"
        },
        {
            "args": {
                "s": "1326#"
            },
            "expected": "acz"
        },
        {
            "args": {
                "s": "25#24#23#22#21#20#19#18#17#16#15#14#13#"
            },
            "expected": "yxwvutsrqponm"
        },
        {
            "args": {
                "s": "11#12#13#14#15#16#17#18#19#"
            },
            "expected": "klmnopqrs"
        },
        {
            "args": {
                "s": "10#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"
            },
            "expected": "jklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26"
            },
            "expected": "abcdefghijklmnopqrstuvwxybf"
        },
        {
            "args": {
                "s": "10#11#12"
            },
            "expected": "jkab"
        },
        {
            "args": {
                "s": "10#20#30#40#50#60#70#80#90#"
            },
            "expected": "jt~¦°º"
        },
        {
            "args": {
                "s": "10#11#12#13#14#15#"
            },
            "expected": "jklmno"
        },
        {
            "args": {
                "s": "10#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#987654321#"
            },
            "expected": "jklmnopqrstuvwxyzihgfedcu"
        },
        {
            "args": {
                "s": "20#21#22#23#24#25#26#"
            },
            "expected": "tuvwxyz"
        },
        {
            "args": {
                "s": "10#10#10#10#10#10#10#10#10#10#"
            },
            "expected": "jjjjjjjjjj"
        },
        {
            "args": {
                "s": "26#25#24#23#22#21#20#19#18#17#16#15#14#13#12#11#10#"
            },
            "expected": "zyxwvutsrqponmlkj"
        },
        {
            "args": {
                "s": "25#26#"
            },
            "expected": "yz"
        },
        {
            "args": {
                "s": "123456789"
            },
            "expected": "abcdefghi"
        },
        {
            "args": {
                "s": "11#22#33#44#55#66#77#88#99#"
            },
            "expected": "kv¢­¸Ã"
        },
        {
            "args": {
                "s": "25#26#10#10#10#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"
            },
            "expected": "yzjjjklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "52525252525252525252525252525252525252525252525252525252525252525252525252525#"
            },
            "expected": "ebebebebebebebebebebebebebebebebebebebebebebebebebebebebebebebebebebebebebey"
        },
        {
            "args": {
                "s": "26#25#24#23#22#21#20#19#18#17#16#15#14#13#12#11#10#987654321"
            },
            "expected": "zyxwvutsrqponmlkjihgfedcba"
        },
        {
            "args": {
                "s": "10#20#30#40#50#60#70#80#90#11#21#31#41#51#61#71#81#91#26#"
            },
            "expected": "jt~¦°ºku§±»z"
        },
        {
            "args": {
                "s": "12345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#98765432112345678910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#987654321"
            },
            "expected": "abcdefghijklmnopqrstuvwxyzihgfedcbaabcdefghijklmnopqrstuvwxyzihgfedcba"
        },
        {
            "args": {
                "s": "12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#987654321"
            },
            "expected": "lmnopqrstuvwxyzihgfedcba"
        },
        {
            "args": {
                "s": "910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26"
            },
            "expected": "ijklmnopqrstuvwxybf"
        },
        {
            "args": {
                "s": "12345678910#20#30#40#50#60#70#80#90#11#21#31#41#51#61#71#81#91#26#"
            },
            "expected": "abcdefghijt~¦°ºku§±»z"
        },
        {
            "args": {
                "s": "910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#987654321"
            },
            "expected": "ijklmnopqrstuvwxyzihgfedcba"
        },
        {
            "args": {
                "s": "26#10#26#10#26#10#26#10#26#10#26#10#26#10#26#10#"
            },
            "expected": "zjzjzjzjzjzjzjzj"
        },
        {
            "args": {
                "s": "10#20#30#11#21#31#12#22#32#13#23#33#14#24#34#15#25#35#16#26#36#"
            },
            "expected": "jt~kulvmwnxoypz"
        },
        {
            "args": {
                "s": "91#82#73#64#55#46#37#28#19#10#11#12#13#14#15#16#17#18#"
            },
            "expected": "»²© |sjklmnopqr"
        },
        {
            "args": {
                "s": "12#14#16#18#20#22#24#26#11#13#15#17#19#21#23#25#"
            },
            "expected": "lnprtvxzkmoqsuwy"
        },
        {
            "args": {
                "s": "11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#11#"
            },
            "expected": "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk"
        },
        {
            "args": {
                "s": "25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#25#26#"
            },
            "expected": "yzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyzyz"
        },
        {
            "args": {
                "s": "11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#987654321"
            },
            "expected": "klmnopqrstuvwxyzihgfedcba"
        },
        {
            "args": {
                "s": "99999999999999999999999999999999999999999999999999999999999999999999999999999#10#"
            },
            "expected": "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiÃj"
        },
        {
            "args": {
                "s": "10#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#10#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"
            },
            "expected": "jklmnopqrstuvwxyzjklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#"
            },
            "expected": "jjjjjjjjjjjjjjjjjjjjjjjj"
        },
        {
            "args": {
                "s": "910#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"
            },
            "expected": "ijklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "10#20#30#11#21#31#12#22#32#13#23#14#24#15#25#16#26"
            },
            "expected": "jt~kulvmwnxoypbf"
        },
        {
            "args": {
                "s": "10#20#30#40#50#60#70#80#90#10#11#12#13#14#15#16#17#18#19#20#21#22#23#24#25#26#"
            },
            "expected": "jt~¦°ºjklmnopqrstuvwxyz"
        },
        {
            "args": {
                "s": "10#10#10#11#11#11#12#12#12#13#13#13#14#14#14#15#15#15#16#16#16#17#17#17#18#18#18#19#19#19#20#20#20#21#21#21#22#22#22#23#23#23#24#24#24#25#25#25#26#26#26#"
            },
            "expected": "jjjkkklllmmmnnnooopppqqqrrrssstttuuuvvvwwwxxxyyyzzz"
        },
        {
            "args": {
                "s": "10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#"
            },
            "expected": "jjjjjjjjjjjjjjjjjjjjjjj"
        },
        {
            "args": {
                "s": "10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#10#"
            },
            "expected": "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj"
        }
    ];
