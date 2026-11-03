namespace leetcode.manhattan_distances_of_all_arrangements_of_pieces;

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

# 每对格子被 C(mn-2, k-2) 个方案共享；全格子对距离和 = n²·m(m²-1)/6 + m²·n(n²-1)/6。
[export(case: "camelCase")]
micro distance_sum(m: i64, n: i64, k: i64) -> i64 {
    let nx: i64 = n % 1000000007
    let mx: i64 = m % 1000000007
    let px: i64 = nx * nx % 1000000007 * (m * (m * m - 1) / 6 % 1000000007) % 1000000007
    let py: i64 = mx * mx % 1000000007 * (n * (n * n - 1) / 6 % 1000000007) % 1000000007
    let pairs: i64 = (px + py) % 1000000007
    let a: i64 = m * n - 2
    let b: i64 = k - 2
    let mut c: i64 = 1
    let mut i: i64 = 1
    while i <= b {
        c = c * ((a - i + 1) % 1000000007) % 1000000007 * mod_pow(i, 1000000005) % 1000000007
        i = i + 1
    }
    return c * pairs % 1000000007
}

class Solution {
    micro distanceSum(self, m: i64, n: i64, k: i64): i64 {
        return distance_sum(m, n, k)
    }
}
