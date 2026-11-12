// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "num1": "100+0i",
                "num2": "0+100i"
            },
            "expected": "0+10000i"
        },
        {
            "args": {
                "num1": "7+-8i",
                "num2": "-9+2i"
            },
            "expected": "-47+86i"
        },
        {
            "args": {
                "num1": "-50+-50i",
                "num2": "50+50i"
            },
            "expected": "0+-5000i"
        },
        {
            "args": {
                "num1": "1+-1i",
                "num2": "1+-1i"
            },
            "expected": "0+-2i"
        },
        {
            "args": {
                "num1": "1+1i",
                "num2": "1+1i"
            },
            "expected": "0+2i"
        },
        {
            "args": {
                "num1": "2+3i",
                "num2": "3+4i"
            },
            "expected": "-6+17i"
        },
        {
            "args": {
                "num1": "-100+-100i",
                "num2": "100+100i"
            },
            "expected": "0+-20000i"
        },
        {
            "args": {
                "num1": "50+50i",
                "num2": "50+50i"
            },
            "expected": "0+5000i"
        },
        {
            "args": {
                "num1": "33+-50i",
                "num2": "-20+77i"
            },
            "expected": "3190+3541i"
        },
        {
            "args": {
                "num1": "0+0i",
                "num2": "0+0i"
            },
            "expected": "0+0i"
        },
        {
            "args": {
                "num1": "0+0i",
                "num2": "5+6i"
            },
            "expected": "0+0i"
        },
        {
            "args": {
                "num1": "3+4i",
                "num2": "-4+3i"
            },
            "expected": "-24+-7i"
        },
        {
            "args": {
                "num1": "-1+2i",
                "num2": "3+-4i"
            },
            "expected": "5+10i"
        },
        {
            "args": {
                "num1": "2+3i",
                "num2": "3+2i"
            },
            "expected": "0+13i"
        },
        {
            "args": {
                "num1": "10+-10i",
                "num2": "-10+10i"
            },
            "expected": "0+200i"
        },
        {
            "args": {
                "num1": "100+100i",
                "num2": "-100+-100i"
            },
            "expected": "0+-20000i"
        },
        {
            "args": {
                "num1": "-1+1i",
                "num2": "1+1i"
            },
            "expected": "-2+0i"
        },
        {
            "args": {
                "num1": "-1+-1i",
                "num2": "-1+-1i"
            },
            "expected": "0+2i"
        },
        {
            "args": {
                "num1": "12+34i",
                "num2": "56+78i"
            },
            "expected": "-1980+2840i"
        },
        {
            "args": {
                "num1": "25+75i",
                "num2": "-75+25i"
            },
            "expected": "-3750+-5000i"
        },
        {
            "args": {
                "num1": "-50+50i",
                "num2": "50+50i"
            },
            "expected": "-5000+0i"
        },
        {
            "args": {
                "num1": "1+0i",
                "num2": "1+0i"
            },
            "expected": "1+0i"
        },
        {
            "args": {
                "num1": "0+0i",
                "num2": "100+100i"
            },
            "expected": "0+0i"
        },
        {
            "args": {
                "num1": "100+0i",
                "num2": "-100+0i"
            },
            "expected": "-10000+0i"
        },
        {
            "args": {
                "num1": "-25+25i",
                "num2": "25+25i"
            },
            "expected": "-1250+0i"
        },
        {
            "args": {
                "num1": "42+0i",
                "num2": "0+42i"
            },
            "expected": "0+1764i"
        },
        {
            "args": {
                "num1": "0+1i",
                "num2": "1+0i"
            },
            "expected": "0+1i"
        },
        {
            "args": {
                "num1": "0+50i",
                "num2": "50+0i"
            },
            "expected": "0+2500i"
        },
        {
            "args": {
                "num1": "-50+0i",
                "num2": "0+-50i"
            },
            "expected": "0+2500i"
        },
        {
            "args": {
                "num1": "50+0i",
                "num2": "-50+0i"
            },
            "expected": "-2500+0i"
        },
        {
            "args": {
                "num1": "88+11i",
                "num2": "-44+22i"
            },
            "expected": "-4114+1452i"
        },
        {
            "args": {
                "num1": "50+30i",
                "num2": "-20+40i"
            },
            "expected": "-2200+1400i"
        },
        {
            "args": {
                "num1": "-99+99i",
                "num2": "99+99i"
            },
            "expected": "-19602+0i"
        },
        {
            "args": {
                "num1": "75+25i",
                "num2": "-25+75i"
            },
            "expected": "-3750+5000i"
        },
        {
            "args": {
                "num1": "-99+-99i",
                "num2": "99+99i"
            },
            "expected": "0+-19602i"
        },
        {
            "args": {
                "num1": "-1011+789i",
                "num2": "456+123i"
            },
            "expected": "-558063+235431i"
        },
        {
            "args": {
                "num1": "88+88i",
                "num2": "11+11i"
            },
            "expected": "0+1936i"
        },
        {
            "args": {
                "num1": "-100+0i",
                "num2": "-100+0i"
            },
            "expected": "10000+0i"
        },
        {
            "args": {
                "num1": "123+-456i",
                "num2": "-789+101i"
            },
            "expected": "-50991+372207i"
        },
        {
            "args": {
                "num1": "-1+0i",
                "num2": "-1+0i"
            },
            "expected": "1+0i"
        },
        {
            "args": {
                "num1": "50+0i",
                "num2": "0+50i"
            },
            "expected": "0+2500i"
        },
        {
            "args": {
                "num1": "-89+34i",
                "num2": "56+-23i"
            },
            "expected": "-4202+3951i"
        },
        {
            "args": {
                "num1": "0+-50i",
                "num2": "-50+0i"
            },
            "expected": "0+2500i"
        },
        {
            "args": {
                "num1": "-100+0i",
                "num2": "0+100i"
            },
            "expected": "0+-10000i"
        },
        {
            "args": {
                "num1": "66+88i",
                "num2": "88+66i"
            },
            "expected": "0+12100i"
        },
        {
            "args": {
                "num1": "99+99i",
                "num2": "1+1i"
            },
            "expected": "0+198i"
        },
        {
            "args": {
                "num1": "-1+1i",
                "num2": "-1+1i"
            },
            "expected": "0+-2i"
        },
        {
            "args": {
                "num1": "34+56i",
                "num2": "-78+90i"
            },
            "expected": "-7692+-1308i"
        },
        {
            "args": {
                "num1": "-100+0i",
                "num2": "0+-100i"
            },
            "expected": "0+10000i"
        },
        {
            "args": {
                "num1": "0+0i",
                "num2": "-100+-100i"
            },
            "expected": "0+0i"
        },
        {
            "args": {
                "num1": "50+-50i",
                "num2": "-50+50i"
            },
            "expected": "0+5000i"
        },
        {
            "args": {
                "num1": "99+99i",
                "num2": "-99+99i"
            },
            "expected": "-19602+0i"
        },
        {
            "args": {
                "num1": "0+100i",
                "num2": "0+100i"
            },
            "expected": "-10000+0i"
        },
        {
            "args": {
                "num1": "-10+-20i",
                "num2": "10+20i"
            },
            "expected": "300+-400i"
        },
        {
            "args": {
                "num1": "0+-100i",
                "num2": "0+-100i"
            },
            "expected": "-10000+0i"
        },
        {
            "args": {
                "num1": "100+0i",
                "num2": "100+0i"
            },
            "expected": "10000+0i"
        },
        {
            "args": {
                "num1": "-20+-30i",
                "num2": "20+30i"
            },
            "expected": "500+-1200i"
        },
        {
            "args": {
                "num1": "1+0i",
                "num2": "-1+0i"
            },
            "expected": "-1+0i"
        },
        {
            "args": {
                "num1": "1+0i",
                "num2": "0+1i"
            },
            "expected": "0+1i"
        },
        {
            "args": {
                "num1": "99+1i",
                "num2": "1+99i"
            },
            "expected": "0+9802i"
        },
        {
            "args": {
                "num1": "0+100i",
                "num2": "100+0i"
            },
            "expected": "0+10000i"
        },
        {
            "args": {
                "num1": "1+-1i",
                "num2": "-100+100i"
            },
            "expected": "0+200i"
        }
    ];
