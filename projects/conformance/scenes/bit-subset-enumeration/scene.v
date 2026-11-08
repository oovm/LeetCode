namespace probe.bit_subset_enumeration;

using std.collection

micro five_values() -> ArrayList<i64> {
    let mut values: ArrayList<i64> = ArrayList::new(5)
    values.push(3)
    values.push(5)
    values.push(7)
    values.push(9)
    values.push(11)
    return values
}

# 枚举 2^5 个子集求和：每个元素被加 16 次，总和 35 * 16 = 560。
[export(name: "subsetSumTotal")]
micro subset_sum_total() -> i64 {
    let values: ArrayList<i64> = five_values()
    let n: i64 = values.length() as i64
    let one: i64 = 1
    let limit: i64 = one << n
    let mut total: i64 = 0
    let mut mask: i64 = 0
    while mask < limit {
        let mut sum: i64 = 0
        let mut bit: i64 = 0
        while bit < n {
            if mask.bit_and(one << bit) != 0 {
                sum = sum + values⁅bit as usize⁆
            }
            bit = bit + 1
        }
        total = total + sum
        mask = mask + 1
    }
    return total
}

# 0..31 所有掩码的 popcount 之和：5 * 16 = 80。
[export(name: "subsetPopcountTotal")]
micro subset_popcount_total() -> i64 {
    let one: i64 = 1
    let limit: i64 = one << 5
    let mut total: i64 = 0
    let mut mask: i64 = 0
    while mask < limit {
        total = total + mask.count_ones() as i64
        mask = mask + 1
    }
    return total
}

[export(name: "subsetCount")]
micro subset_count() -> i64 {
    let one: i64 = 1
    return one << 5
}
