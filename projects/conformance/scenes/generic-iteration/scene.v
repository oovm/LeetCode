namespace probe.generic_iteration;

using std.collection;
using std.iterator;

micro triple(value: i64) -> i64 {
    return value * 3
}

micro add_i64(accumulator: i64, value: i64) -> i64 {
    return accumulator + value
}

# 泛型容器 + 高阶权重函数：元素类型由调用点决定，权重函数按 `T` 单态化。
micro weighted_total<T>(items: ArrayList<T>, weight: micro(T) -> i64) -> i64 {
    let mut total: i64 = 0
    loop item in items {
        total = total + weight(item)
    }
    return total
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

[export(name: "genericWeightedTotal")]
micro generic_weighted_total() -> i64 {
    return weighted_total(filled_ascending(5), triple)
}

# 嵌套泛型容器：ArrayList<ArrayList<i64>> 双层遍历。
[export(name: "nestedTotal")]
micro nested_total() -> i64 {
    let mut rows: ArrayList<ArrayList<i64>> = ArrayList::new(3)
    rows.push(filled_ascending(2))
    rows.push(filled_ascending(1))
    rows.push(filled_ascending(2))
    let mut total: i64 = 0
    loop row in rows {
        loop value in row {
            total = total + value
        }
    }
    return total
}
