namespace leetcode.count_the_number_of_arrays_with_k_matching_adjacent_elements;

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

# m·(m-1)^(n-1-k)·C(n-1, k)：首位任选，非相邻等位逐位异前。
[export(case: "camelCase")]
micro count_good_arrays(n: i64, m: i64, k: i64) -> i64 {
    let md: i64 = 1000000007
    let mut c: i64 = 1
    let mut i: i64 = 1
    while i <= k {
        c = c * ((n - i) % md) % md * mod_pow(i, md - 2) % md
        i = i + 1
    }
    return m % md * mod_pow(m - 1, n - 1 - k) % md * c % md
}

class Solution {
    micro countGoodArrays(self, n: i64, m: i64, k: i64): i64 {
        return count_good_arrays(n, m, k)
    }
}
