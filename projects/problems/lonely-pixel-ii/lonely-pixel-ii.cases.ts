// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "picture": [["B", "W"], ["W", "B"]],
                "target": 1
            },
            "expected": 2
        },
        {
            "args": {
                "picture": [["W", "W", "B"], ["W", "W", "B"], ["W", "W", "B"]],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "B"], ["W", "B", "W"], ["B", "W", "B"]],
                "target": 2
            },
            "expected": 4
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "B", "W"],
                    ["W", "B", "W", "B", "B", "W"],
                    ["W", "B", "W", "B", "B", "W"],
                    ["W", "W", "B", "W", "B", "W"]
                ],
                "target": 3
            },
            "expected": 6
        },
        {
            "args": {
                "picture": [["B", "B", "B"], ["B", "B", "B"], ["B", "B", "B"]],
                "target": 3
            },
            "expected": 9
        },
        {
            "args": {
                "picture": [["W", "B", "W"], ["W", "B", "W"], ["B", "W", "B"]],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "W"], ["W", "B", "W"], ["W", "W", "B"]],
                "target": 1
            },
            "expected": 3
        },
        {
            "args": {
                "picture": [["W", "W", "B"], ["W", "W", "B"], ["W", "W", "B"]],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "W"], ["W", "W", "W"], ["W", "W", "W"]],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "W"], ["W", "W", "W"], ["W", "W", "W"]],
                "target": 0
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "B"], ["B", "W", "B"], ["B", "W", "B"]],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "B", "W"],
                    ["W", "B", "W", "B", "B", "W"],
                    ["W", "B", "W", "B", "B", "W"],
                    ["W", "W", "B", "W", "B", "W"]
                ],
                "target": 3
            },
            "expected": 6
        },
        {
            "args": {
                "picture": [["W", "W", "W"], ["W", "W", "W"], ["W", "W", "W"]],
                "target": 0
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "B"], ["W", "B", "W"], ["B", "W", "B"]],
                "target": 1
            },
            "expected": 1
        },
        {
            "args": {
                "picture": [["W", "B"], ["B", "W"]],
                "target": 1
            },
            "expected": 2
        },
        {
            "args": {
                "picture": [["B", "B", "B"], ["B", "B", "B"], ["B", "B", "B"]],
                "target": 3
            },
            "expected": 9
        },
        {
            "args": {
                "picture": [
                    ["B", "B", "B", "W", "W"],
                    ["B", "B", "B", "W", "W"],
                    ["B", "B", "B", "W", "W"],
                    ["W", "W", "W", "B", "B"],
                    ["W", "W", "W", "B", "B"]
                ],
                "target": 3
            },
            "expected": 9
        },
        {
            "args": {
                "picture": [["W", "B", "W", "B", "W"], ["B", "W", "B", "W", "B"], ["W", "B", "W", "B", "W"], ["B", "W", "B", "W", "B"]],
                "target": 2
            },
            "expected": 4
        },
        {
            "args": {
                "picture": [["W", "B", "B", "W"], ["W", "B", "B", "W"], ["W", "B", "B", "W"], ["B", "W", "W", "B"]],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "W", "W"],
                    ["W", "W", "B", "W", "W"],
                    ["W", "B", "B", "B", "W"],
                    ["W", "W", "B", "W", "W"],
                    ["W", "W", "W", "W", "W"]
                ],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "B"], ["W", "B", "W"], ["B", "W", "W"], ["W", "W", "B"], ["W", "B", "W"], ["B", "W", "W"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "W", "W", "W", "W", "W"],
                    ["W", "W", "W", "B", "W", "W", "W"],
                    ["W", "W", "W", "W", "W", "B", "W"],
                    ["B", "W", "W", "W", "W", "W", "W"],
                    ["W", "W", "W", "B", "W", "W", "W"],
                    ["W", "W", "W", "W", "W", "B", "W"],
                    ["B", "W", "W", "W", "W", "W", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "B", "B", "B", "B"],
                    ["B", "W", "W", "W", "B"],
                    ["B", "W", "W", "W", "B"],
                    ["B", "W", "W", "W", "B"],
                    ["B", "B", "B", "B", "B"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "W", "B"], ["B", "W", "W", "B"], ["B", "W", "W", "B"], ["B", "W", "W", "B"], ["W", "W", "W", "W"]],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "B", "W"],
                    ["W", "W", "W", "W", "W"],
                    ["W", "W", "W", "W", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "B", "W", "B", "W", "B"], ["B", "W", "B", "W", "B", "W", "B"], ["B", "W", "B", "W", "B", "W", "B"]],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "B", "B"], ["W", "B", "B", "W"], ["B", "W", "B", "B"], ["B", "W", "B", "B"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "W", "W"],
                    ["W", "B", "W", "W", "W"],
                    ["W", "B", "W", "W", "W"],
                    ["W", "B", "W", "W", "W"],
                    ["W", "B", "W", "W", "W"]
                ],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "B", "W", "W"], ["B", "B", "W", "W"], ["W", "W", "B", "B"], ["W", "W", "B", "B"]],
                "target": 2
            },
            "expected": 8
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B", "W"],
                    ["W", "W", "W", "W", "W", "W"],
                    ["B", "W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "W", "W"],
                    ["W", "B", "B", "W"],
                    ["W", "B", "B", "W"],
                    ["W", "W", "W", "B"],
                    ["B", "B", "B", "B"],
                    ["B", "B", "B", "B"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "B", "B", "B"], ["W", "W", "W", "W"], ["B", "B", "B", "B"], ["W", "W", "W", "W"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "W", "B"], ["B", "W", "W", "B"], ["B", "W", "W", "B"], ["B", "W", "W", "B"]],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W"],
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "B", "W"]
                ],
                "target": 2
            },
            "expected": 4
        },
        {
            "args": {
                "picture": [["B", "W", "W", "B"], ["B", "W", "W", "B"], ["B", "B", "B", "B"], ["W", "W", "W", "B"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "B", "W", "B", "W", "B"], ["W", "B", "W", "B", "W", "B", "W"], ["B", "W", "B", "W", "B", "W", "B"]],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W"]
                ],
                "target": 5
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "B", "W", "B"], ["W", "B", "B", "B", "W"], ["W", "W", "B", "W", "B"], ["W", "B", "B", "B", "W"]],
                "target": 2
            },
            "expected": 2
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "B", "W", "W", "W"],
                    ["W", "B", "B", "B", "W", "W"],
                    ["B", "B", "B", "B", "B", "W"],
                    ["W", "B", "B", "B", "W", "W"],
                    ["W", "W", "B", "W", "W", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "W", "W", "W"],
                    ["W", "B", "W", "W", "W", "W"],
                    ["W", "B", "W", "W", "W", "W"],
                    ["W", "B", "W", "W", "W", "W"],
                    ["W", "B", "W", "W", "W", "W"]
                ],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "B", "B", "W", "W"], ["W", "B", "B", "W", "W"], ["W", "B", "B", "W", "W"], ["W", "B", "B", "W", "W"]],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W", "B", "W"]
                ],
                "target": 3
            },
            "expected": 9
        },
        {
            "args": {
                "picture": [["W", "B", "W", "B"], ["B", "W", "B", "W"], ["W", "B", "W", "B"], ["B", "W", "B", "W"]],
                "target": 2
            },
            "expected": 8
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "B", "W"]
                ],
                "target": 5
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "B", "B", "W"], ["B", "B", "B", "W"], ["B", "B", "B", "W"], ["W", "W", "W", "B"]],
                "target": 3
            },
            "expected": 9
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "W", "W"],
                    ["W", "W", "W", "W", "W"],
                    ["W", "W", "W", "W", "W"],
                    ["W", "W", "W", "W", "W"],
                    ["W", "W", "W", "W", "W"]
                ],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "W", "W"],
                    ["B", "B", "B", "B", "B"],
                    ["W", "W", "W", "W", "W"],
                    ["B", "B", "B", "B", "B"],
                    ["W", "W", "W", "W", "W"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "B", "W", "B"], ["B", "B", "W", "B"], ["W", "W", "W", "W"], ["B", "B", "W", "B"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "W", "W", "W", "W", "W"],
                    ["W", "B", "B", "B", "B", "B", "B", "W"],
                    ["W", "B", "W", "W", "W", "W", "B", "W"],
                    ["W", "B", "W", "W", "W", "W", "B", "W"],
                    ["W", "B", "B", "B", "B", "B", "B", "W"],
                    ["W", "W", "W", "W", "W", "W", "W", "W"]
                ],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "B", "B", "W"],
                    ["W", "W", "B", "B", "W"],
                    ["W", "W", "B", "B", "W"],
                    ["B", "B", "W", "W", "B"],
                    ["B", "B", "W", "W", "B"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "W", "B"], ["W", "B", "W", "B"], ["B", "W", "W", "B"], ["B", "B", "B", "B"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "B", "B", "W"], ["W", "W", "B", "B", "W"], ["W", "W", "B", "B", "W"], ["W", "W", "B", "B", "W"]],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "B", "W", "W"],
                    ["W", "B", "B", "B", "W"],
                    ["B", "B", "B", "B", "B"],
                    ["W", "B", "B", "B", "W"],
                    ["W", "W", "B", "W", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "B", "W", "W"],
                    ["B", "W", "W", "B", "B"],
                    ["B", "W", "W", "B", "B"],
                    ["W", "B", "B", "W", "W"],
                    ["W", "B", "B", "W", "W"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "W", "W", "B"],
                    ["W", "B", "B", "W", "W"],
                    ["W", "B", "B", "W", "W"],
                    ["B", "W", "W", "W", "B"],
                    ["B", "W", "W", "W", "B"]
                ],
                "target": 2
            },
            "expected": 4
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "W", "B"],
                    ["B", "W", "B", "B", "W"],
                    ["W", "B", "W", "W", "B"],
                    ["W", "B", "B", "B", "W"],
                    ["B", "W", "W", "W", "B"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W", "B"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "W", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "B", "W", "W", "W"],
                    ["W", "W", "W", "B", "W"],
                    ["W", "B", "W", "W", "W"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "B", "W", "W", "W"],
                    ["W", "W", "W", "B", "W", "W", "W"],
                    ["W", "W", "W", "B", "W", "W", "W"],
                    ["B", "B", "B", "W", "B", "B", "B"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "W", "B"], ["B", "W", "W", "B"], ["W", "B", "W", "B"], ["W", "W", "W", "B"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W", "B"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "B", "W", "B"],
                    ["W", "W", "W", "W", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "W", "W", "W", "W"],
                    ["B", "W", "B", "W", "B"]
                ],
                "target": 3
            },
            "expected": 9
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "W", "B"],
                    ["B", "W", "W", "B", "W"],
                    ["B", "W", "W", "W", "B"],
                    ["B", "W", "W", "B", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "B", "B", "W"], ["B", "W", "W", "B"], ["B", "W", "W", "B"], ["W", "B", "B", "W"]],
                "target": 2
            },
            "expected": 8
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B", "W"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "W", "W", "W"],
                    ["W", "B", "B", "B", "B", "W"],
                    ["W", "B", "W", "W", "B", "W"],
                    ["W", "B", "B", "B", "B", "W"],
                    ["W", "W", "W", "W", "W", "W"]
                ],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W", "B"]
                ],
                "target": 5
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "W"], ["W", "B", "W"], ["W", "W", "W"], ["W", "B", "W"], ["W", "W", "W"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "B", "W", "W", "B"],
                    ["W", "B", "W", "B", "W", "W"],
                    ["B", "W", "W", "W", "B", "W"],
                    ["W", "W", "B", "W", "W", "B"]
                ],
                "target": 2
            },
            "expected": 4
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "W", "B", "W"],
                    ["W", "W", "W", "W", "W"],
                    ["B", "W", "W", "B", "W"],
                    ["W", "W", "W", "W", "W"],
                    ["B", "W", "W", "B", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "W", "B", "B"], ["W", "W", "B", "W"], ["B", "W", "B", "B"], ["B", "W", "B", "B"]],
                "target": 3
            },
            "expected": 6
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W"],
                    ["B", "B", "B", "B", "B"],
                    ["W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "B", "W", "W"],
                    ["W", "W", "W", "B", "W", "W"],
                    ["W", "W", "W", "B", "W", "W"],
                    ["W", "W", "W", "B", "W", "W"],
                    ["W", "W", "W", "B", "W", "W"]
                ],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "B", "W", "W", "B"],
                    ["B", "B", "W", "W", "B"],
                    ["W", "W", "B", "B", "W"],
                    ["W", "W", "B", "B", "W"],
                    ["B", "B", "W", "W", "B"]
                ],
                "target": 3
            },
            "expected": 9
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B"],
                    ["B", "W", "B", "W", "B"]
                ],
                "target": 5
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["B", "B", "B", "B", "B", "B"],
                    ["B", "B", "B", "B", "B", "B"],
                    ["B", "B", "B", "B", "B", "B"],
                    ["B", "B", "B", "B", "B", "B"],
                    ["B", "B", "B", "B", "B", "B"],
                    ["B", "B", "B", "B", "B", "B"]
                ],
                "target": 6
            },
            "expected": 36
        },
        {
            "args": {
                "picture": [["B", "W", "W", "B", "W"], ["B", "W", "W", "B", "W"], ["B", "W", "W", "B", "W"], ["B", "W", "W", "B", "W"]],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "B", "B", "B"], ["B", "B", "B", "B"], ["B", "B", "B", "B"], ["B", "B", "B", "B"]],
                "target": 4
            },
            "expected": 16
        },
        {
            "args": {
                "picture": [["W", "W", "W", "W"], ["B", "W", "W", "B"], ["W", "W", "W", "W"], ["B", "W", "W", "B"], ["W", "W", "W", "W"]],
                "target": 2
            },
            "expected": 4
        },
        {
            "args": {
                "picture": [["W", "B", "B", "W", "W"], ["B", "B", "B", "B", "W"], ["W", "B", "B", "W", "W"], ["B", "B", "B", "B", "W"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W"],
                    ["B", "W", "B", "W", "B"],
                    ["W", "B", "W", "B", "W"],
                    ["W", "B", "W", "B", "W"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "W", "W"], ["W", "B", "B", "W"], ["W", "B", "B", "W"], ["W", "W", "W", "W"]],
                "target": 2
            },
            "expected": 4
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "W", "W"],
                    ["B", "B", "B", "B", "B"],
                    ["W", "B", "W", "W", "W"],
                    ["B", "B", "B", "B", "B"],
                    ["W", "B", "W", "W", "W"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "W", "W"],
                    ["W", "B", "B", "B", "W"],
                    ["W", "B", "W", "B", "W"],
                    ["W", "B", "B", "B", "W"],
                    ["W", "W", "W", "W", "W"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "W", "W"], ["B", "B", "B", "B"], ["W", "W", "W", "W"], ["B", "B", "B", "B"], ["W", "W", "W", "W"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "B", "B"], ["B", "B", "B"], ["B", "B", "B"], ["B", "B", "B"]],
                "target": 4
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "B", "B", "W"], ["B", "W", "B", "B"], ["B", "B", "B", "W"], ["W", "W", "W", "W"]],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "B", "W", "W", "W"],
                    ["W", "B", "W", "W", "W"],
                    ["B", "B", "W", "W", "W"],
                    ["W", "B", "W", "W", "W"],
                    ["W", "B", "W", "W", "W"]
                ],
                "target": 2
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["B", "B", "B", "W"], ["B", "B", "B", "W"], ["B", "B", "B", "W"], ["W", "W", "W", "W"]],
                "target": 3
            },
            "expected": 9
        },
        {
            "args": {
                "picture": [
                    ["B", "W", "W", "B"],
                    ["B", "W", "W", "B"],
                    ["B", "W", "W", "B"],
                    ["W", "W", "W", "B"],
                    ["W", "W", "W", "B"],
                    ["W", "W", "W", "B"]
                ],
                "target": 3
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [
                    ["W", "W", "W", "W", "W", "W"],
                    ["W", "W", "B", "W", "W", "W"],
                    ["W", "B", "B", "B", "W", "W"],
                    ["W", "W", "B", "W", "W", "W"],
                    ["W", "W", "W", "W", "W", "W"]
                ],
                "target": 1
            },
            "expected": 0
        },
        {
            "args": {
                "picture": [["W", "W", "B", "W"], ["W", "B", "B", "W"], ["B", "B", "B", "W"], ["W", "B", "B", "W"], ["W", "W", "B", "W"]],
                "target": 2
            },
            "expected": 0
        }
    ];
