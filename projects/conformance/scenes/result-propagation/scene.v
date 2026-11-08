namespace probe.result_propagation;

using std.types

# 标量错误码：0 表示无错误，1 = 除零，2 = 负数输入，3 = 兜底。
micro checked_div(value: i64, divisor: i64) -> Result<i64, i64> {
    if divisor == 0 {
        return Fail(1)
    }
    if value < 0 {
        return Fail(2)
    }
    return Fine(value / divisor)
}

# 两层 `Result` 传播：任一层 `Fail` 都原样回传，不做降级。
micro checked_chain(a: i64, b: i64, c: i64) -> Result<i64, i64> {
    match checked_div(a, b) {
        case Fine(first): {
            match checked_div(first, c) {
                case Fine(second): {
                    return Fine(second)
                }
                case Fail(inner_error): {
                    return Fail(inner_error)
                }
            }
        }
        case Fail(outer_error): {
            return Fail(outer_error)
        }
    }
    return Fail(3)
}

micro result_code(outcome: Result<i64, i64>) -> i64 {
    return match outcome {
        case Fine(value): value
        case Fail(error): 0 - error
    }
}

[export(name: "chainSuccess")]
micro chain_success() -> i64 {
    return result_code(checked_chain(100, 5, 2))
}

[export(name: "chainDivisionByZero")]
micro chain_division_by_zero() -> i64 {
    return result_code(checked_chain(100, 0, 2))
}

[export(name: "chainNestedFail")]
micro chain_nested_fail() -> i64 {
    return result_code(checked_chain(100, 5, 0))
}

[export(name: "chainNegativeInput")]
micro chain_negative_input() -> i64 {
    return result_code(checked_chain(-100, 5, 2))
}
