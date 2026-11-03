namespace leetcode.find_the_count_of_numbers_which_are_not_special;

micro is_prime(x: i64) -> bool {
    if x < 2 {
        return false
    }
    if x % 2 == 0 {
        return x == 2
    }
    if x % 3 == 0 {
        return x == 3
    }
    let mut d: i64 = 5
    while d * d <= x {
        if x % d == 0 || x % (d + 2) == 0 {
            return false
        }
        d = d + 6
    }
    return true
}

micro isqrt_floor(x: i64) -> i64 {
    let mut r: i64 = 0
    while (r + 1) * (r + 1) <= x {
        r = r + 1
    }
    return r
}

# 特殊数 = 恰有两个因子的数 = 质数的平方；答案 = 区间长 - [⌈√l⌉, ⌊√r⌋] 内质数个数。
[export(case: "camelCase")]
micro non_special_count(l: i64, r: i64) -> i64 {
    let hi: i64 = isqrt_floor(r)
    let mut lo: i64 = isqrt_floor(l)
    if lo * lo < l {
        lo = lo + 1
    }
    let mut primes: i64 = 0
    let mut p: i64 = lo
    while p <= hi {
        if is_prime(p) {
            primes = primes + 1
        }
        p = p + 1
    }
    return r - l + 1 - primes
}

class Solution {
    micro nonSpecialCount(self, l: i64, r: i64): i64 {
        return non_special_count(l, r)
    }
}
