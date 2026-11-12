// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "expression": "!(!(t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(t,t,t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,f,f,t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(t,t,t,t,t,t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(&(t,f),|(t,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(f,t),&(t,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(|(t,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,f),&(f,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(f,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,t,f,t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(f)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(f,t)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(!(t),f)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(f),&(f,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(t,|(f,f,f,t),!(&(f,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(t,t,t,t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(t),|(f)),&(t,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,f,f,f,f,f)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "t"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(t,f)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "f"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(|(t,f),&(f,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(t)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,f),t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(!(!(t)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(f,t),|(t,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(t,f),&(f,t),|(t,t),&(f,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(t,f,t,f)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(t,t,t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(t,f),|(f,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,&(t,f),|(f,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(t,f),&(f,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,f),|(t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,!(t),&(|(f,f),|(t,t)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(|(|(t,f),f),t),!(f),&(t,!(f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(&(t,|(f,f),t),&(f,!(t),t),|(t,f,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(f,t,f),&(t,f)),|(t,t,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(t,&(f,f),t),&(f,|(t,f),t),|(&(f,t),f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,|(f,f,f)),!(|(t,t,t)),&(f,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(&(t,f),&(f,f)),&(t,!(t)),f)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(f,t),&(t,f),|(f,t),&(t,f),|(f,t),&(t,f),|(f,t),&(t,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(f,!(t),|(&(t,!(t)),|(t,f,f,t,f)),&(f,f,t,t,t,t,f,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(t,|(f,!(t),&(t,f,t,t),|(f,f,f,f)),&(f,|(t,f,t,t,t)),!(f,|(t,f,f,f,f)),&(t,t,t),t)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,f),&(f,t),|(t,t),|(f,f),!(t),!(f),&(t,|(t,t)),|(t,&(t,f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(&(f,t),&(t,f),&(f,t),&(t,f),&(f,t),&(t,f),&(f,t),&(t,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(|(|(|(|(|(|(|(t),f),t),f),f),f),&(t,t,t,t,t,t,t,t),|(t,f,f,t,f),&(f,f,t,t,t,t,f,t),f,t)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,!(f)),&(f,!(t)),&(t,t),!(f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,!(t),&(t,f),!(f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(&(f,t),|(t,f),!(f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(f,t),&(f,f)),|(t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(f,f,t),!(t),|(f,f,f),&(|(t,f),f),|(t,t,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(t,f,f),f),|(t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(f,!(t),&(t,!(f)),|(f,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(t,f),|(f,t),&(t,t),|(t,t),&(t,f),|(f,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(f,!(t),&(t,f)),!(|(f,f,t)),&(t,f),|(f,t,t,t),&(t,|(f,f,f),t),&(t,f,f,t),|(t,!(f),f),f,!(t),&(f,t,f),|(t,f,t),f,!(t),&(f,t,f),|(t,f,t),f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(&(f,t),f),f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,!(f),&(t,f),|(t,t,f,f),&(t,t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(f,f,t),!(t),|(f,t,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(&(t,f),&(f,f)),&(t,t),f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(f,!(t),|(f,f,t),&(t,t,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(t,|(f,!(t),&(t,f,t),|(f,f,f)),&(f,|(t,f,t,t)),!(f,|(t,f)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(t,f),f),&(t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(t,|(f,!(t),&(t,f)),&(f,|(t,f,t)),!(f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(&(t,t),&(t,|(t,t)),&(t,|(t,|(t,t))),&(t,|(t,|(t,|(t,t)))))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(f,t),&(t,f)),|(f,f,f,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(f,f,t),!(t),|(f,f,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(f,|(&(f,t),f),|(t,t),!(&(f,t)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(|(f,t),f),&(f,t,f,t)),|(f,f,f,f,f,t,t),&(t,t,t,t,t,t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(f,!(t),|(&(t,!(t)),|(t,f,f,t,f)),&(f,f,t,t,t,t),&(t,t,t,t,t,t,t,t),f)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(|(|(f),f),t),&(t,f,t),!(f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(t,f),&(f,t)),|(t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(t,t,t),&(t,t,t),&(f,f,f),|(t,t,t),|(f,f,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(!(f),t),|(f,&(t,f),f),&(t,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(t,!(f),&(t,f)),!(|(f,f,t)),&(t,f),|(f,t,t,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(t,!(f),&(f,t)),|(t,!(t),&(f,f)),|(t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(&(t,!(t)),f,!(f),t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(&(t,t),&(f,f)),|(&(t,f),&(t,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(f,|(&(f,t),f),|(t,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,!(t)),f,!(f),t,!(|(&(f,t),f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(f,|(&(t,f),f),&(t,t,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,&(|(t,f),&(t,f)),|(t,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(t,!(f),|(&(t,t),|(f,f)),&(|(t,f),f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(&(t,f),t),&(f,|(t,f,t))),|(f,!(t),&(t,f,t)),!(f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(t,f),&(t,f),|(t,t),|(f,f),&(t,!(f)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(|(|(f),f),f)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(f,!(t),&(t,!(f)),|(f,t),!(&(t,!(t))))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(|(|(|(|(t),f),t),f),&(t,!(f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(|(|(|(|(|(|(|(f),f),f),f),f),f),f),f)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(f,f,f,t),!(t),|(t,t,t)),|(f,&(t,|(f,t),&(f,f)),!(f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(|(|(|(t),f),t),f),&(t,t,t,t,t,t,t,t),|(t,f,f,t,f),&(f,f,t,t,t,t,f,t),f)"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(f,&(|(f,f),t),&(f,|(t,f),f),!(f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(|(t,f),f),&(t,!(f)),!(|(t,f)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(f,f,f),|(t,f,t),&(t,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(t,&(f,t)),|(t,|(f,f)),&(t,|(t,|(f,t))),|(t,&(f,|(f,t))))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(|(f,&(t,|(t,f)),!(t)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(|(|(|(f),t),f),t),&(t,f,t),!(f),|(t,f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(t,f),&(f,f)),!(|(t,t,t,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(f,f,t),&(f,f,f),!(t),|(t,f,f,f,t),&(f,t,t,f))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(|(&(t,|(f,t)),t),&(f,!(t),t)),|(t,!(f),&(f,f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(f,f,f,t),|(t,f,t,f),&(t,t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(f,&(t,|(f,t),&(f,f)),!(f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(|(|(|(|(|(|(t),f),t),f),f),f),&(t,t,t,t,t,t,t,t),&(t,t,t,t,t,t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(t,f),!(f),&(t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(t,&(|(f,f),&(t,f)),&(t,|(t,f),&(f,f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(|(|(|(f,t),t),f),&(f,|(t,!(t),f),&(t,t,t,t,t,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(|(&(f,t),|(t,f),&(f,f),|(t,t),&(t,f),|(f,f)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,t,t,t),|(|(f,f),f),&(t,f,f,t,t),!(t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(&(f,t),&(t,f),|(t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(|(f,f,f),&(t,t,t),!(|(f,f)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(&(f,f),t),f),|(f,|(t,f),&(f,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(&(t,t,t,t),|(f,f,f,f),&(t,f,t,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(&(t,f,!(t)),&(t,f,t),&(f,!(t)),!(f),t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(|(|(f,t),t),f),&(f,|(t,!(t),f),&(t,t,t,t,t,t)),!(|(t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t,t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(&(t,!(f),&(t,t),|(t,f),&(t,!(t),&(f,f))))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(f,f),&(t,t),&(t,f)),|(t,!(t),&(t,f)),&(t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(|(|(|(|(f),t),f),t),&(t,f,t),!(f),|(t,f)),&(f,t,t,f),!(t))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(t,f),&(t,t,t),!(f),&(f,!(t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(!(!(!(!(t)))))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(|(t,f),|(f,t),&(t,t),|(t,t),&(t,f),|(f,t),!(t),!(f),&(t,|(t,t)),|(t,&(t,f)),&(f,|(t,f)),|(f,|(t,f)))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "&(f,|(t,|(f,!(t))))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(|(|(|(|(f),f),t),&(t,f,t),!(f),|(t,f)),&(f,t,t,f))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(&(t,t),|(f,f),&(f,t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(&(t,f),f),&(t,|(t,f))),|(t,!(f),t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(&(|(&(t,f),t),&(f,|(t,f))),|(f,!(t)))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "&(f,&(|(f,f,t),!(t),|(f,f,f)),|(f,&(t,|(f,t),&(f,f)),!(f)),!(&(|(f,f,f,t),!(t),|(t,t,t)),|(f,&(t,|(f,t),&(f,f)),!(f))))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "|(&(f,t,f),|(t,f,t),&(t,t,t,t,t))"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "|(|(|(t,f),f),&(|(t,t),&(f,t))),!(t)"
            },
            "expected": true
        },
        {
            "args": {
                "expression": "!(|(t,!(t),&(t,!(f))))"
            },
            "expected": false
        },
        {
            "args": {
                "expression": "!(|(&(t,!(t)),&(f,!(f)),&(t,t),!(f)))"
            },
            "expected": false
        }
    ];
