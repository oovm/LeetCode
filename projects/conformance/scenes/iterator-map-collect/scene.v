namespace probe.iterator_map_collect;

using std.collection;
using std.iterator;

micro negate(value: i64) -> i64 {
    return -value
}

micro filled_ascending(count: i64) -> ArrayList<i64> {
    let mut values: ArrayList<i64> = ArrayList::new(count as usize)
    let mut value: i64 = 1
    while value <= count {
        values.push(value)
        value = value + 1
    }
    return values
}

# 单个适配器后接收集终端。
[export(name: "mapCollectTotal")]
micro map_collect_total() -> i64 {
    let mapped: ArrayList<i64> = filled_ascending(8).into_iterator().map(negate).collect()
    let mut total: i64 = 0
    loop value in mapped {
        total = total + value
    }
    return total
}
