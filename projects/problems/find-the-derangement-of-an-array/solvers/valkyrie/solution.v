namespace leetcode.find_the_derangement_of_an_array;

# 错位排列 D(n) = (n-1)·(D(n-1) + D(n-2))，滚动两变量，模 10^9+7。
[export(case: "camelCase")]
micro find_derangement(n: i64) -> i64 {
    if n == 1 {
        return 0
    }
    let mut prev2: i64 = 1
    let mut prev1: i64 = 0
    let mut i: i64 = 2
    while i <= n {
        let current: i64 = (i - 1) * (prev1 + prev2) % 1000000007
        prev2 = prev1
        prev1 = current
        i = i + 1
    }
    return prev1
}

class Solution {
    micro findDerangement(self, n: i64): i64 {
        return find_derangement(n)
    }
}
