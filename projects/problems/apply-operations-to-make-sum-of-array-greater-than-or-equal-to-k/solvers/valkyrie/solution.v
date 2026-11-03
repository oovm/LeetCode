namespace leetcode.apply_operations_to_make_sum_of_array_greater_than_or_equal_to_k;

# 枚举峰值 v：升到 v 需 v-1 次自加，余量 ⌈(k-v)/v⌉ 次复制，取最小。
[export(case: "camelCase")]
micro min_operations(k: i64) -> i64 {
    let mut best: i64 = k - 1
    let mut v: i64 = 1
    while v <= k {
        let rest: i64 = k - v
        let copies: i64 = (rest + v - 1) / v
        let total: i64 = v - 1 + copies
        if total < best {
            best = total
        }
        v = v + 1
    }
    return best
}

class Solution {
    micro minOperations(self, k: i64): i64 {
        return min_operations(k)
    }
}
