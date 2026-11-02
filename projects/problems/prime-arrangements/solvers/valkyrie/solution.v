namespace leetcode.prime_arrangements;

micro is_prime(x: i64) -> bool {
    if x < 2 {
        return false
    }
    let mut d: i64 = 2
    while d * d <= x {
        if x % d == 0 {
            return false
        }
        d = d + 1
    }
    return true
}

micro factorial_mod(x: i64, m: i64) -> i64 {
    let mut r: i64 = 1
    let mut i: i64 = 2
    while i <= x {
        r = (r * i) % m
        i = i + 1
    }
    return r
}

[export(case: "camelCase")]
micro num_prime_arrangements(n: i64) -> i64 {
    let md: i64 = 1000000007
    let mut primes: i64 = 0
    let mut i: i64 = 2
    while i <= n {
        if is_prime(i) {
            primes = primes + 1
        }
        i = i + 1
    }
    return (factorial_mod(primes, md) * factorial_mod(n - primes, md)) % md
}

class Solution {
    micro numPrimeArrangements(self, n: i64): i64 {
        return num_prime_arrangements(n)
    }
}
