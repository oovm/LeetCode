namespace leetcode.largest_palindrome_product;

micro reverse_of(x: i64) -> i64 {
    let mut result: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        result = result * 10 + rest % 10
        rest = rest / 10
    }
    return result
}

micro pow10(p: i64) -> i64 {
    let mut result: i64 = 1
    let mut i: i64 = 0
    while i < p {
        result = result * 10
        i = i + 1
    }
    return result
}

# 上半段递减构造 2n 位回文，首个可分解为两个 n 位整数者即最大。
[export(case: "camelCase")]
micro largest_palindrome(n: i64) -> i64 {
    if n == 1 {
        return 9
    }
    let upper_max: i64 = pow10(n) - 1
    let lower_min: i64 = pow10(n - 1)
    let mut half: i64 = upper_max - 1
    while half > lower_min {
        let palindrome: i64 = half * pow10(n) + reverse_of(half)
        let mut d: i64 = upper_max
        while d * d >= palindrome {
            if palindrome % d == 0 {
                return palindrome % 1337
            }
            d = d - 1
        }
        half = half - 1
    }
    return 0
}

class Solution {
    micro largestPalindrome(self, n: i64): i64 {
        return largest_palindrome(n)
    }
}
