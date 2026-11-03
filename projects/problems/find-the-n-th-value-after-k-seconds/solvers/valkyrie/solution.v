namespace leetcode.find_the_n_th_value_after_k_seconds;

micro mod_pow(base: i64, exp: i64) -> i64 {
    let mut result: i64 = 1
    let mut b: i64 = base % 1000000007
    let mut e: i64 = exp
    while e > 0 {
        if e % 2 == 1 {
            result = result * b % 1000000007
        }
        b = b * b % 1000000007
        e = e / 2
    }
    return result
}

micro comb_mod(a: i64, b: i64) -> i64 {
    if b < 0 || b > a {
        return 0
    }
    let mut r: i64 = 1
    let mut i: i64 = 1
    while i <= b {
        r = r * (a - b + i) % 1000000007 * mod_pow(i, 1000000005) % 1000000007
        i = i + 1
    }
    return r
}

# 全 1 数组经 k 轮前缀和，末位 = C(n+k-1, k) mod 10^9+7。
[export(case: "camelCase")]
micro value_after_k_seconds(n: i64, k: i64) -> i64 {
    return comb_mod(n + k - 1, k)
}

class Solution {
    micro valueAfterKSeconds(self, n: i64, k: i64): i64 {
        return value_after_k_seconds(n, k)
    }
}
