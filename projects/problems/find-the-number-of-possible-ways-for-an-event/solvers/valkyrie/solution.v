namespace leetcode.find_the_number_of_possible_ways_for_an_event;

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

# Σ_k C(x,k)·surj(n,k)·y^k，surj 用容斥 Σ (-1)^i C(k,i)(k-i)^n，组合数递推配费马逆元。
[export(case: "camelCase")]
micro number_of_ways(n: i64, x: i64, y: i64) -> i64 {
    let mut total: i64 = 0
    let mut yk: i64 = 1
    let mut cxk: i64 = 1
    let mut k: i64 = 1
    let mut lim: i64 = x
    if n < x {
        lim = n
    }
    while k <= lim {
        cxk = cxk * (x - k + 1) % 1000000007 * mod_pow(k, 1000000005) % 1000000007
        yk = yk * y % 1000000007
        let mut onto: i64 = 0
        let mut cki: i64 = 1
        let mut i: i64 = 0
        while i <= k {
            let term: i64 = cki * mod_pow(k - i, n) % 1000000007
            if i % 2 == 0 {
                onto = (onto + term) % 1000000007
            } else {
                onto = (onto + 1000000007 - term) % 1000000007
            }
            cki = cki * (k - i) % 1000000007 * mod_pow(i + 1, 1000000005) % 1000000007
            i = i + 1
        }
        total = (total + cxk * onto % 1000000007 * yk) % 1000000007
        k = k + 1
    }
    return total
}

class Solution {
    micro numberOfWays(self, n: i64, x: i64, y: i64): i64 {
        return number_of_ways(n, x, y)
    }
}
