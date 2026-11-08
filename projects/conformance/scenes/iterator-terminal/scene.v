namespace probe.iterator_terminal;

using std.collection;
using std.iterator;

micro add_i64(accumulator: i64, value: i64) -> i64 {
    return accumulator + value
}

micro is_positive(value: i64) -> bool {
    return value > 0
}

micro is_odd(value: i64) -> bool {
    return value % 2 != 0
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

# 终端算子直接接在适配器调用结果上。
[export(name: "foldSum")]
micro fold_sum() -> i64 {
    let values: ArrayList<i64> = filled_ascending(3)
    return values.into_iterator().fold(0 as i64, add_i64)
}

# 谓词终端直接接在适配器调用结果上。
[export(name: "anyAll")]
micro any_all() -> i64 {
    let values: ArrayList<i64> = filled_ascending(3)
    let any_positive: bool = values.into_iterator().any(is_positive)
    let all_odd: bool = values.into_iterator().all(is_odd)
    if any_positive && !all_odd {
        return 1
    }
    return 0
}

# enumerate 适配器改变元素身份，count 收尾。
[export(name: "enumerateCount")]
micro enumerate_count() -> i64 {
    let values: ArrayList<i64> = filled_ascending(8)
    return values.into_iterator().enumerate().count() as i64
}
