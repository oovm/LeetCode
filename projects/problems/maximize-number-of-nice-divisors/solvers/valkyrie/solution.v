namespace leetcode.maximize_number_of_nice_divisors;

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

# 因子数最大化 = 拆 3：余 1 拆一个 4，余 2 挂一个 2。
[export(case: "camelCase")]
micro max_nice_divisors(primeFactors: i64) -> i64 {
    if primeFactors <= 3 {
        return primeFactors
    }
    if primeFactors % 3 == 1 {
        return 4 * mod_pow(3, (primeFactors - 4) / 3) % 1000000007
    }
    if primeFactors % 3 == 2 {
        return 2 * mod_pow(3, (primeFactors - 2) / 3) % 1000000007
    }
    return mod_pow(3, primeFactors / 3)
}

class Solution {
    micro maxNiceDivisors(self, primeFactors: i64): i64 {
        return max_nice_divisors(primeFactors)
    }
}
