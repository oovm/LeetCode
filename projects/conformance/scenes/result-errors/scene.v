namespace probe.result_errors;

using std.types

# 领域错误联合：带载荷的失败原因。
unite MathError {
    [constructor]
    DivideByZero {
        dividend: i64
    }

    [constructor]
    NegativeInput {
        value: i64
    }
}

micro safe_div(dividend: i64, divisor: i64) -> Result<i64, MathError> {
    if divisor == 0 {
        return Fail(DivideByZero { dividend: dividend })
    }
    return Fine(dividend / divisor)
}

micro fail_reason(error: MathError) -> i64 {
    match error {
        case DivideByZero(dividend): {
            return -1
        }
        case NegativeInput(value): {
            return -2
        }
    }
}

micro division_by_zero_or(error: MathError) -> i64 {
    return -3
}

[export(name: "safeDivFine")]
micro safe_div_fine() -> i64 {
    let outcome: Result<i64, MathError> = safe_div(20, 4)
    return outcome.unwrap_or(-1)
}

[export(name: "unwrapOrElse")]
micro unwrap_or_else_case() -> i64 {
    let outcome: Result<i64, MathError> = safe_div(7, 0)
    return outcome.unwrap_or_else(division_by_zero_or)
}
