namespace probe.option_map_chain;

using std.types

micro square(value: i64) -> i64 {
    return value * value
}

micro halve_even(value: i64) -> Option<i64> {
    if value % 2 != 0 {
        return None
    }
    return Some(value / 2)
}

micro is_odd(value: i64) -> bool {
    return value % 2 != 0
}

# Some(3) 经 map 平方得 9。
[export(name: "optionMapSquare")]
micro option_map_square() -> i64 {
    let value: Option<i64> = Some(3)
    return value.map(square).unwrap_or(-1)
}

# None 经 map 仍为 None。
[export(name: "optionMapNone")]
micro option_map_none() -> i64 {
    let value: Option<i64> = None
    return value.map(square).unwrap_or(-1)
}

# 20 连续两次减半落到 5。
[export(name: "optionAndThenChain")]
micro option_and_then_chain() -> i64 {
    let value: Option<i64> = Some(20)
    let once: Option<i64> = value.and_then(halve_even)
    let twice: Option<i64> = once.and_then(halve_even)
    return twice.unwrap_or(-1)
}

# 9 在 and_then 中失败，后续链路保持 None。
[export(name: "optionAndThenMiss")]
micro option_and_then_miss() -> i64 {
    let value: Option<i64> = Some(9)
    let once: Option<i64> = value.and_then(halve_even)
    let twice: Option<i64> = once.and_then(halve_even)
    return twice.unwrap_or(-1)
}

# 过滤保留奇数 7。
[export(name: "optionFilterKeeps")]
micro option_filter_keeps() -> i64 {
    let value: Option<i64> = Some(7)
    return value.filter(is_odd).unwrap_or(-1)
}

# 过滤丢弃偶数 8。
[export(name: "optionFilterDrops")]
micro option_filter_drops() -> i64 {
    let value: Option<i64> = Some(8)
    return value.filter(is_odd).unwrap_or(-1)
}
