namespace leetcode.count_the_number_of_ideal_arrays;

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

micro choose_mod(a: i64, b: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 1
    while i <= b {
        result = result * ((a - i + 1) % 1000000007) % 1000000007 * mod_pow(i, 1000000005) % 1000000007
        i = i + 1
    }
    return result
}

# 以 v 结尾的链 = 各素幂 e 上 C(n-1+e, e) 之积（星棒法单调指数序列）。
[export(case: "camelCase")]
micro ideal_arrays(n: i64, max_value: i64) -> i64 {
    let mut total: i64 = 0
    let mut v: i64 = 1
    while v <= max_value {
        let mut rest: i64 = v
        let mut ways: i64 = 1
        let mut d: i64 = 2
        while d * d <= rest {
            if rest % d == 0 {
                let mut e: i64 = 0
                while rest % d == 0 {
                    rest = rest / d
                    e = e + 1
                }
                ways = ways * choose_mod(n - 1 + e, e) % 1000000007
            }
            d = d + 1
        }
        if rest > 1 {
            ways = ways * choose_mod(n, 1) % 1000000007
        }
        total = (total + ways) % 1000000007
        v = v + 1
    }
    return total
}

class Solution {
    micro idealArrays(self, n: i64, maxValue: i64): i64 {
        return ideal_arrays(n, maxValue)
    }
}
