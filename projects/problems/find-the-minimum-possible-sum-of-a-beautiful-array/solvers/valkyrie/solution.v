namespace leetcode.find_the_minimum_possible_sum_of_a_beautiful_array;

# 贪心：先取 i < target - i 的小端，剩余从 target 起连续取。
[export(case: "camelCase")]
micro minimum_possible_sum(n: i64, target: i64) -> i64 {
    let mut m: i64 = (target - 1) / 2
    if n < m {
        m = n
    }
    let rest: i64 = n - m
    return m * (m + 1) / 2 + rest * target + rest * (rest - 1) / 2
}

class Solution {
    micro minimumPossibleSum(self, n: i64, target: i64): i64 {
        return minimum_possible_sum(n, target)
    }
}
