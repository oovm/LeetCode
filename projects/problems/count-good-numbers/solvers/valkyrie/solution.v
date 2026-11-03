namespace leetcode.count_good_numbers;

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

# 偶数位 5 种、奇数位 4 种：5^⌈n/2⌉ · 4^⌊n/2⌋ mod 10^9+7。
[export(case: "camelCase")]
micro count_good_numbers(n: i64) -> i64 {
    return mod_pow(5, (n + 1) / 2) * mod_pow(4, n / 2) % 1000000007
}

class Solution {
    micro countGoodNumbers(self, n: i64): i64 {
        return count_good_numbers(n)
    }
}
