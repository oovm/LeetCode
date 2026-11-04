namespace leetcode.maximum_number_that_makes_result_of_bitwise_and_zero;

# 不超过 n 的最高 2 幂减一：其低位全开，与紧跟的 2 幂相与为零。
[export(case: "camelCase")]
micro max_number(n: i64) -> i64 {
    let mut p: i64 = 1
    while p <= n / 2 {
        p = p * 2
    }
    return p - 1
}

class Solution {
    micro maxNumber(self, n: i64): i64 {
        return max_number(n)
    }
}
