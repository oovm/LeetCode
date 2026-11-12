// 本文件由 `json_to_cases_ts.mjs` 从 `metadata.json` 逐字转换生成；整数经 BigInt 逐字保真，勿手改数值。
import type { ProblemCases } from '../../conformance/src/isolated/cases.ts';

export const cases: ProblemCases = [
        {
            "args": {
                "s": "(())*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((((**))))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "****"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()****)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()***)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)*())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "())(*"
            },
            "expected": false
        },
        {
            "args": {
                "s": "((*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()))"
            },
            "expected": false
        },
        {
            "args": {
                "s": "(()(()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(())))"
            },
            "expected": false
        },
        {
            "args": {
                "s": "(***)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*()*(*)*())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(())*(())*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**))*((*))*(**)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((((()))))))***"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((())))*(())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(()*(())*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()***(())()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**(*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)*(*)(*)*(*)(*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((()))))))**(()((()))"
            },
            "expected": false
        },
        {
            "args": {
                "s": "(()(()(()(*)))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*((((**)))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((**))))*(((**))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*(*(*(*(*(*)))))****)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((((())))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((((((*))))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)*(()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**(())(*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()**(**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((())((**)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)*)((**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*(***))*))*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*((*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)*(*(*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()**(((())))****"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)**(**)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*(**)))*(**)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*(**))*)*()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((()))*(()**)**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(())*(())*(())*((()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**(**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*())*()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)()(**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**((*)*))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()***(())*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)(*(*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((())))*****"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)(*))(())((**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)(*)(*)(*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*(((******)))*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**)*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()(()(()(*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)*(((**))*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(**))*((*)*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()(()())*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(()*(()*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*(()*(())))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*(*(*(*)))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(())*()(())*()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((****))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((())*)*))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((((()))))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((((**)))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*((())))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()(()))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((()**)))(((()**)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((()*****)****))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**)))(**("
            },
            "expected": false
        },
        {
            "args": {
                "s": "(())(())((**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*(*(*(*)))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((*))())*())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*(*)*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((*)))((***))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*(()*(())*(())**)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((***)))(((***)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*()**(**)()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)(*))*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((*)**)*(***))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((*((*)))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "**(()))*((***)**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((())))*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)*(*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**)((()))*)**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*()(*()*)*())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*))(*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)*(**(()**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((**)))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*())*()()*(())*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((()))*(((**)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*(((*)*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((****)))()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)(*))(*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**())((()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((*))*)*(()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((((******)))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*(*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(()*())*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((((*)))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(***(**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*(())))(((()))*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()***)((()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**())*(**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(())**(())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**)*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()(**)()*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*(())*)*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*(*(*))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*(*(())*)*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((()))(*(*)*())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)(*)(*))((*)*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*(*(*(*))))*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((())))**(**)***"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**(())*(**)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()(*(*)*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*(())**(())*(())*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*((((())))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*()*(*)()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**((((**))))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*(()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(()*(()*(()*())))*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((***))((***))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)*(*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((*)))((**))((*))*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((*)))()*)*"
            },
            "expected": true
        },
        {
            "args": {
                "s": "**((**))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((*)(*)(*))))****"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()**())((**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()**(**)()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**()))(*(()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((()**))**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*((())))**)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*(()**()))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((*))))(*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**)(**)(**)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()))(**("
            },
            "expected": false
        },
        {
            "args": {
                "s": "((*)((*)*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)(*)(*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*()(*))**((*))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((*)(*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((***(****)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(((())))(*)(())"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((**))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**(*)*())(())**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(***(())***)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((())*(())*(())**)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "()(*(*(*())))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*(*)**(*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((()))*()**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(*)*(*(*)*(*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(())(((*)))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*()(*))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()*(()*()**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((*)**))***)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((()))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "*(((****)(**))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(())((()))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "**((((((()))))))**"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((**(**))**(**))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(**(*)*)"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((((*))*)*))))"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(()***)()"
            },
            "expected": true
        },
        {
            "args": {
                "s": "(())((()))***"
            },
            "expected": true
        },
        {
            "args": {
                "s": "((()))(*)(((***)))*"
            },
            "expected": true
        }
    ];
