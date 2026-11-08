namespace probe.enum_variant_argument;

using std.types

enums MathError {
    DivisionByZero
    NegativeInput
}

# 理想写法：裸变体直接作为 `Fail` 的实参。
[export(name: "inlineVariant")]
micro inline_variant() -> i64 {
    let outcome: Result<i64, MathError> = Fail(DivisionByZero)
    return match outcome {
        case Fine(value): value
        case Fail(error): 0 - 1
    }
}
