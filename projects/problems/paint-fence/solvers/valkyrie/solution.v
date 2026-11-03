namespace leetcode.paint_fence;

# f(1)=k、f(2)=k²，f(i)=(f(i-1)+f(i-2))·(k-1)，滚动两变量。
[export(case: "camelCase")]
micro num_ways(n: i64, k: i64) -> i64 {
    if n == 1 {
        return k
    }
    let mut prev2: i64 = k
    let mut prev1: i64 = k * k
    let mut i: i64 = 3
    while i <= n {
        let cur: i64 = (prev1 + prev2) * (k - 1)
        prev2 = prev1
        prev1 = cur
        i = i + 1
    }
    return prev1
}

class Solution {
    micro numWays(self, n: i64, k: i64): i64 {
        return num_ways(n, k)
    }
}
