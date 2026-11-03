namespace leetcode.the_kth_factor_of_n;

# 先扫 1..√n 的小因子，不足 k 再从大端回数。
[export(case: "camelCase")]
micro kth_factor(n: i64, k: i64) -> i64 {
    let mut count: i64 = 0
    let mut d: i64 = 1
    while d * d <= n {
        if n % d == 0 {
            count = count + 1
            if count == k {
                return d
            }
        }
        d = d + 1
    }
    # 大因子回数：若 d*d == n（完全平方），对称轴自身只计一次。
    d = d - 1
    if d * d == n {
        d = d - 1
    }
    while d >= 1 {
        if n % d == 0 {
            count = count + 1
            if count == k {
                return n / d
            }
        }
        d = d - 1
    }
    return -1
}

class Solution {
    micro kthFactor(self, n: i64, k: i64): i64 {
        return kth_factor(n, k)
    }
}
