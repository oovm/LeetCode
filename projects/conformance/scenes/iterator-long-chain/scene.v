namespace probe.iterator_long_chain;

using std.collection
using std.iterator

micro ascending(count: i64) -> ArrayList<i64> {
    let mut values: ArrayList<i64> = ArrayList::new(count as usize)
    let mut value: i64 = 1
    while value <= count {
        values.push(value)
        value = value + 1
    }
    return values
}

# 长链：filter -> map -> skip -> take -> filter -> fold，全程不落中间变量。
# 闭包使用语言正式的 `micro(参数) -> 返回 { ... }` 形态。
[export(name: "longChainTotal")]
micro long_chain_total() -> i64 {
    return ascending(12).into_iterator().filter(micro(x: i64) -> bool { return x % 2 == 1 }).map(micro(x: i64) -> i64 { return x * 3 }).skip(2).take(4).filter(micro(x: i64) -> bool { return x > 15 }).fold(0, micro(accumulator: i64, item: i64) -> i64 { return accumulator + item })
}

# 另一条链：map -> filter -> count，元素重复放大后再筛。
[export(name: "longChainCount")]
micro long_chain_count() -> i64 {
    return ascending(12).into_iterator().map(micro(x: i64) -> i64 { return x * 2 }).filter(micro(x: i64) -> bool { return x % 3 == 0 }).count() as i64
}
