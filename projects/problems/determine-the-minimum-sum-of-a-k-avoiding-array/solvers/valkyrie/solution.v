namespace leetcode.determine_the_minimum_sum_of_a_k_avoiding_array;

# 贪心：先取 1..min(⌊k/2⌋, n)（配对 (i, k-i) 只取小端），剩余从 k 起连续取。
[export(case: "camelCase")]
micro minimum_sum(n: i64, k: i64) -> i64 {
    let mut m: i64 = k / 2
    if n < m {
        m = n
    }
    let rest: i64 = n - m
    return m * (m + 1) / 2 + rest * k + rest * (rest - 1) / 2
}

class Solution {
    micro minimumSum(self, n: i64, k: i64): i64 {
        return minimum_sum(n, k)
    }
}
