namespace probe.enum_equality;

using std.text

enums Phase {
    Alpha
    Beta
}

# 纯标记 `enums` 的相等比较，按语言直觉直接写 `==`。
[export(name: "sameEnumEqual")]
micro same_enum_equal() -> i64 {
    let left: Phase = Alpha
    let right: Phase = Alpha
    return if left == right { 1 } else { 0 }
}

[export(name: "differentEnumEqual")]
micro different_enum_equal() -> i64 {
    let left: Phase = Alpha
    let right: Phase = Beta
    return if left == right { 1 } else { 0 }
}
