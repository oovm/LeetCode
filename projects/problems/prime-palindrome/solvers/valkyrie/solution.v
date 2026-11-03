namespace leetcode.prime_palindrome;

# i64 安全的加倍取模乘（避免 a·b 溢出）。
micro mul_mod(a: i64, b: i64, m: i64) -> i64 {
    let mut result: i64 = 0
    let mut x: i64 = a % m
    let mut y: i64 = b
    while y > 0 {
        if y % 2 == 1 {
            result = (result + x) % m
        }
        x = (x + x) % m
        y = y / 2
    }
    return result
}

micro pow_mod(base: i64, exp: i64, m: i64) -> i64 {
    let mut result: i64 = 1
    let mut b: i64 = base % m
    let mut e: i64 = exp
    while e > 0 {
        if e % 2 == 1 {
            result = mul_mod(result, b, m)
        }
        b = mul_mod(b, b, m)
        e = e / 2
    }
    return result
}

micro witness(base: i64, d: i64, r: i64, n: i64) -> bool {
    let mut x: i64 = pow_mod(base % n, d, n)
    if x == 1 || x == n - 1 {
        return true
    }
    let mut i: i64 = 1
    let mut passed: bool = false
    while i < r {
        x = mul_mod(x, x, n)
        if x == n - 1 {
            passed = true
        }
        i = i + 1
    }
    return passed
}

# 2^64 内确定性 Miller-Rabin 基组。
micro is_prime(n: i64) -> bool {
    if n < 2 {
        return false
    }
    if n % 2 == 0 {
        return n == 2
    }
    let mut d: i64 = n - 1
    let mut r: i64 = 0
    while d % 2 == 0 {
        d = d / 2
        r = r + 1
    }
    return witness(2, d, r, n) && witness(325, d, r, n) && witness(9375, d, r, n) && witness(28178, d, r, n) && witness(450775, d, r, n) && witness(9780504, d, r, n) && witness(1795265022, d, r, n)
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

micro digit_count(x: i64) -> i64 {
    let mut count: i64 = 0
    let mut rest: i64 = x
    while rest > 0 {
        count = count + 1
        rest = rest / 10
    }
    return count
}

micro odd_palindrome(half: i64) -> i64 {
    let mut p: i64 = half
    let mut x: i64 = half / 10
    while x > 0 {
        p = p * 10 + x % 10
        x = x / 10
    }
    return p
}

# 偶长回文都被 11 整除（除 11 自身），只扫奇长回文的半段镜像。
[export(case: "camelCase")]
micro prime_palindrome(n: i64) -> i64 {
    if n <= 2 {
        return 2
    }
    if n <= 3 {
        return 3
    }
    if n <= 5 {
        return 5
    }
    if n <= 7 {
        return 7
    }
    if n <= 11 {
        return 11
    }
    let mut len: i64 = digit_count(n)
    if len % 2 == 0 {
        len = len + 1
    }
    while len <= 15 {
        let base: i64 = pow10((len - 1) / 2)
        let mut half: i64 = base
        while half < base * 10 {
            let p: i64 = odd_palindrome(half)
            if p >= n && is_prime(p) {
                return p
            }
            half = half + 1
        }
        len = len + 2
    }
    return -1
}

class Solution {
    micro primePalindrome(self, n: i64): i64 {
        return prime_palindrome(n)
    }
}
