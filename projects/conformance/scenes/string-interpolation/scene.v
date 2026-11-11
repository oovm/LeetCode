namespace probe.string_interpolation;

using std.collection

# 文本段与已定型变量按源码顺序拼接：`ab-7`。
[export(name: "interpolatedMixedChecksum")]
micro interpolated_mixed_checksum() -> i64 {
    let name: utf8 = "ab"
    let suffix: utf8 = "-7"
    let text: utf8 = "{ name }{ suffix }"
    let mut total: i64 = 0
    loop current in text {
        total = total + (current as u32) as i64
    }
    return total
}

# `\{`/`\}` 是字面花括号，不开启插值：`x{y}`。
[export(name: "bracedLiteralChecksum")]
micro braced_literal_checksum() -> i64 {
    let text: utf8 = "x\{y\}"
    let mut total: i64 = 0
    loop current in text {
        total = total + (current as u32) as i64
    }
    return total
}

# 共享可变容器承载计数：`mut` 值形参是副本，不能用来观察调用副作用。
micro bump(mut counter: ArrayList<i64>) -> i64 {
    let next: i64 = counter⁅0⁆ + 1
    counter.set_cardinal(0, next)
    return next
}

# 两次有副作用调用按源码顺序各求值一次，结果为 `12`。
[export(name: "interpolatedOrderValue")]
micro interpolated_order_value() -> i64 {
    let mut counter: ArrayList<i64> = ArrayList::new(1)
    counter.push(0)
    let text: utf8 = "{ bump(counter) }{ bump(counter) }"
    let mut value: i64 = 0
    loop current in text {
        value = value * 10 + ((current as u32) as i64 - 48)
    }
    return value
}
