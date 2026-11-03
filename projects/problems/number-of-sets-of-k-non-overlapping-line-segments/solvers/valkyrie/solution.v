namespace leetcode.number_of_sets_of_k_non_overlapping_line_segments;

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

# 组合数 C(n+k-1, 2k) mod p：乘性逐项 × Fermat 逆元，免阶乘表。
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

[export(case: "camelCase")]
micro number_of_sets(n: i64, k: i64) -> i64 {
    return comb_mod(n + k - 1, 2 * k)
}

class Solution {
    micro numberOfSets(self, n: i64, k: i64): i64 {
        return number_of_sets(n, k)
    }
}
