namespace probe.prefix_sum_binary_search;

using std.collection

# 前缀和表长度比原数组多 1，`prefix[i]` 是前 i 个元素之和。
micro build_prefix(values: ArrayList<i64>) -> ArrayList<i64> {
    let mut prefix: ArrayList<i64> = ArrayList::new(values.length() + 1)
    prefix.push(0)
    let mut running: i64 = 0
    loop value in values {
        running = running + value
        prefix.push(running)
    }
    return prefix
}

micro sum_range(prefix: ArrayList<i64>, start: i64, end: i64) -> i64 {
    return prefix⁅end as usize⁆ - prefix⁅start as usize⁆
}

# 有序数组里第一个不小于 target 的下标；不存在则返回长度。
micro lower_bound(values: ArrayList<i64>, target: i64) -> i64 {
    let mut low: i64 = 0
    let mut high: i64 = values.length() as i64
    while low < high {
        let middle: i64 = low + (high - low) / 2
        if values⁅middle as usize⁆ < target {
            low = middle + 1
        } else {
            high = middle
        }
    }
    return low
}

# 前缀和单调递增：二分找最少前缀元素个数，使其和达到 target。
micro prefix_reach_length(prefix: ArrayList<i64>, target: i64) -> i64 {
    let mut low: i64 = 1
    let mut high: i64 = prefix.length() as i64 - 1
    if prefix⁅high as usize⁆ < target {
        return -1
    }
    while low < high {
        let middle: i64 = low + (high - low) / 2
        if prefix⁅middle as usize⁆ < target {
            low = middle + 1
        } else {
            high = middle
        }
    }
    return low
}

# 3,1,4,1,5,9,2,6 的区间 [2,6) 之和为 4+1+5+9 = 19。
[export(name: "rangeSum")]
micro range_sum_export() -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(8)
    values.push(3)
    values.push(1)
    values.push(4)
    values.push(1)
    values.push(5)
    values.push(9)
    values.push(2)
    values.push(6)
    let prefix: ArrayList<i64> = build_prefix(values)
    return sum_range(prefix, 2, 6)
}

# 1,3,5,7,9,11 里第一个不小于 6 的下标为 3。
[export(name: "lowerBoundIndex")]
micro lower_bound_index() -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(6)
    values.push(1)
    values.push(3)
    values.push(5)
    values.push(7)
    values.push(9)
    values.push(11)
    return lower_bound(values, 6)
}

# 1,2,3,4,5 的前缀和 0,1,3,6,10,15：达到 7 至少需要 4 个元素。
[export(name: "prefixReachLength")]
micro prefix_reach_length_export() -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(5)
    values.push(1)
    values.push(2)
    values.push(3)
    values.push(4)
    values.push(5)
    let prefix: ArrayList<i64> = build_prefix(values)
    return prefix_reach_length(prefix, 7)
}
