namespace probe.iterator_pipeline;

using std.collection;
using std.iterator;

micro triple(value: i64) -> i64 {
    return value * 3
}

micro negate(value: i64) -> i64 {
    return -value
}

micro is_even(value: i64) -> bool {
    return value % 2 == 0
}

micro add_i64(accumulator: i64, value: i64) -> i64 {
    return accumulator + value
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

# 迭代器适配器链：filter 后 map，再收集成 ArrayList。
[export(name: "iteratorPipelineTotal")]
micro iterator_pipeline_total() -> i64 {
    let values: ArrayList<i64> = filled_ascending(8)
    let evens: ArrayList<i64> = values.into_iterator().filter(is_even).map(negate).collect()
    let mut total: i64 = 0
    loop value in evens {
        total = total + value * 3
    }
    return total
}

# 终端算子 fold：初始值与累加函数决定结果类型。
[export(name: "iteratorFoldTotal")]
micro iterator_fold_total() -> i64 {
    let values: ArrayList<i64> = filled_ascending(8)
    return values.into_iterator().fold(0 as i64, add_i64)
}
