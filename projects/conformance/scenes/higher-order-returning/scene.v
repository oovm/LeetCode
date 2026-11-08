namespace probe.higher_order_returning;

# 返回函数的高阶函数：组合两个一元函数，闭包捕获形参函数值。
micro compose(outer: micro(i64) -> i64, inner: micro(i64) -> i64) -> micro(i64) -> i64 {
    let composed: micro(i64) -> i64 = micro(x: i64) -> i64 { return outer(inner(x)) }
    return composed
}

# 把同一函数重复两次，返回新的函数值。
micro twice(step: micro(i64) -> i64) -> micro(i64) -> i64 {
    let repeated: micro(i64) -> i64 = micro(x: i64) -> i64 { return step(step(x)) }
    return repeated
}

micro increment(value: i64) -> i64 {
    return value + 1
}

micro square(value: i64) -> i64 {
    return value * value
}

[export(name: "composedValue")]
micro composed_value() -> i64 {
    let transform: micro(i64) -> i64 = compose(square, increment)
    return transform(4)
}

[export(name: "twiceValue")]
micro twice_value() -> i64 {
    let stepped: micro(i64) -> i64 = twice(increment)
    return stepped(3)
}
