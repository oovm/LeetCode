namespace leetcode.find_the_child_who_has_the_ball_after_k_seconds;

# 往返周期 2(n-1)：k 对周期取余后，r < n 即正向第 r 个孩子，否则折返 2(n-1)-r。
[export(case: "camelCase")]
micro number_of_child(n: i64, k: i64) -> i64 {
    let period: i64 = 2 * (n - 1)
    let r: i64 = k % period
    if r < n {
        return r
    }
    return period - r
}

class Solution {
    micro numberOfChild(self, n: i64, k: i64): i64 {
        return number_of_child(n, k)
    }
}
