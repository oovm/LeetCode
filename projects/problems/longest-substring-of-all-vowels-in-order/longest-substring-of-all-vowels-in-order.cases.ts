// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "word": "aeiaaioaaaaeiiaaaiiiiiouuuooaauuaeiuuuuuuuuuuuuuuuuuuuuaaa"
            },
            "expected": 0
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiaaaiiiiiouuuaauuaeiu"
            },
            "expected": 0
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiaaaiiiiiouuuuuuuuuuuuuuuuuuuuaaaaaaeiou"
            },
            "expected": 10
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiioooaeiouuuaeiouuu"
            },
            "expected": 7
        },
        {
            "args": {
                "word": "aeeeiiiioooauuuaeiou"
            },
            "expected": 5
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiiiouuuuuaaaaaaaaaeeeeiiiioooouuuuuu"
            },
            "expected": 27
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiaaaiiiiiouuuooaaeiouaaaaaaaaaaeiouuuuuuuuuuuuuuuuuuuu"
            },
            "expected": 33
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiioooaeiouuuaeiouuuaeiouuu"
            },
            "expected": 7
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiaaaouuuooauuaeiu"
            },
            "expected": 0
        },
        {
            "args": {
                "word": "aeiouaeiouaeiouaeiouaeiou"
            },
            "expected": 5
        },
        {
            "args": {
                "word": "aaaaaaaaaeeeeeeeeeeiiiiiiioooooouuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu"
            },
            "expected": 68
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiioooaeiouuu"
            },
            "expected": 7
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiooouuuaeiou"
            },
            "expected": 13
        },
        {
            "args": {
                "word": "a"
            },
            "expected": 0
        },
        {
            "args": {
                "word": "aeiou"
            },
            "expected": 5
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiaaaiiiiiouuuuuuuuuuuuuuuuuuuu"
            },
            "expected": 0
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiaaaouuuooaauuaeiaaioaaaaeiiiiouuuooaauuaeiu"
            },
            "expected": 13
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiiiouuuooaauuaeiu"
            },
            "expected": 13
        },
        {
            "args": {
                "word": "aeiaaioaaaaeiiooouuuooauuaeiu"
            },
            "expected": 13
        },
        {
            "args": {
                "word": "uuuuuuuuuuuuuuuuuuuu"
            },
            "expected": 0
        }
    ];
