// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "paragraph": "Bob hit a ball, the hit BALL flew far after it was hit.",
                "banned": ["hit"]
            },
            "expected": "ball"
        },
        {
            "args": {
                "paragraph": "a.",
                "banned": []
            },
            "expected": "a"
        },
        {
            "args": {
                "paragraph": "a, a, a, a, b,b,b,c, c",
                "banned": ["a"]
            },
            "expected": "b"
        },
        {
            "args": {
                "paragraph": "Bob",
                "banned": []
            },
            "expected": "bob"
        },
        {
            "args": {
                "paragraph": "Hello. Hello! hello?",
                "banned": []
            },
            "expected": "hello"
        },
        {
            "args": {
                "paragraph": "the quick brown fox jumps over the lazy dog the",
                "banned": []
            },
            "expected": "the"
        },
        {
            "args": {
                "paragraph": "a a a b b c",
                "banned": ["a", "b"]
            },
            "expected": "c"
        },
        {
            "args": {
                "paragraph": "one two two three three three",
                "banned": []
            },
            "expected": "three"
        },
        {
            "args": {
                "paragraph": "Hi hi HI hello hi",
                "banned": []
            },
            "expected": "hi"
        },
        {
            "args": {
                "paragraph": "a-b-c a",
                "banned": []
            },
            "expected": "a"
        },
        {
            "args": {
                "paragraph": "word word word other other",
                "banned": []
            },
            "expected": "word"
        },
        {
            "args": {
                "paragraph": "A a B b C c a",
                "banned": []
            },
            "expected": "a"
        },
        {
            "args": {
                "paragraph": "test",
                "banned": []
            },
            "expected": "test"
        },
        {
            "args": {
                "paragraph": "a, b, c, d, d, d",
                "banned": ["a", "b", "c"]
            },
            "expected": "d"
        },
        {
            "args": {
                "paragraph": "Yes yes yes no no",
                "banned": ["no"]
            },
            "expected": "yes"
        },
        {
            "args": {
                "paragraph": "x y z x y x",
                "banned": []
            },
            "expected": "x"
        },
        {
            "args": {
                "paragraph": "The the The THE the",
                "banned": []
            },
            "expected": "the"
        },
        {
            "args": {
                "paragraph": "abc abc abd abd abd",
                "banned": []
            },
            "expected": "abd"
        },
        {
            "args": {
                "paragraph": "a b b c c c d d d d",
                "banned": []
            },
            "expected": "d"
        },
        {
            "args": {
                "paragraph": "Hello, world! Hello world? HELLO",
                "banned": []
            },
            "expected": "hello"
        }
    ];
