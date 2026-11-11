namespace leetcode.beautiful_arrangement_ii;

using std.collection;

# 从 1 开始，先用 k-1 步在 `high` / `low` 两端交替取数，制造 k-1 个递减的新差值；
# 剩余数字按「最后一次取高则降序、取低则升序」补齐，只再引入差值 1。整体 O(n)。
[export(case: "camelCase")]
micro constructArray(n: i64, k: i64) -> [i64] {
    let mut result: ArrayList<i64> = ArrayList::new(n as usize)
    result.push(1)
    let mut low: i64 = 2
    let mut high: i64 = n
    let mut appended: i64 = 0
    let mut take_high: bool = true
    let mut last_high: bool = false
    while appended < k - 1 {
        if take_high {
            result.push(high)
            high = high - 1
            last_high = true
        } else {
            result.push(low)
            low = low + 1
            last_high = false
        }
        appended = appended + 1
        take_high = take_high == false
    }
    if appended > 0 && last_high {
        let mut value: i64 = high
        while value >= low {
            result.push(value)
            value = value - 1
        }
    } else {
        let mut value: i64 = low
        while value <= high {
            result.push(value)
            value = value + 1
        }
    }
    return result.to_array()
}

class Solution {
    micro constructArray(self, n: i64, k: i64): [i64] {
        return constructArray(n, k)
    }
}
