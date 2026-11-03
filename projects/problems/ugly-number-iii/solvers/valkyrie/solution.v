namespace leetcode.ugly_number_iii;

micro gcd(a: i64, b: i64) -> i64 {
    let mut x: i64 = a
    let mut y: i64 = b
    while y != 0 {
        let t: i64 = x % y
        x = y
        y = t
    }
    return x
}

# 溢出保护 lcm：超过 cap 即返回 cap + 1（计数函数自然归零）。
micro lcm_capped(a: i64, b: i64, cap: i64) -> i64 {
    let g: i64 = gcd(a, b)
    if a / g > cap / b {
        return cap + 1
    }
    return a / g * b
}

micro count_le(x: i64, ab: i64, ac: i64, bc: i64, abc: i64, a: i64, b: i64, c: i64) -> i64 {
    return x / a + x / b + x / c - x / ab - x / ac - x / bc + x / abc
}

[export(case: "camelCase")]
micro nth_ugly_number(n: i64, a: i64, b: i64, c: i64) -> i64 {
    # 上界：min(a,b,c)·n ≤ 10^18 < 2^63。
    let mut least: i64 = a
    if b < least {
        least = b
    }
    if c < least {
        least = c
    }
    let cap: i64 = least * n
    let ab: i64 = lcm_capped(a, b, cap)
    let ac: i64 = lcm_capped(a, c, cap)
    let bc: i64 = lcm_capped(b, c, cap)
    let abc: i64 = lcm_capped(ab, c, cap)
    let mut low: i64 = least
    let mut high: i64 = cap
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if count_le(mid, ab, ac, bc, abc, a, b, c) >= n {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro nthUglyNumber(self, n: i64, a: i64, b: i64, c: i64): i64 {
        return nth_ugly_number(n, a, b, c)
    }
}
