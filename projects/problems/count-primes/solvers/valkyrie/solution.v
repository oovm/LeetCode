namespace leetcode.count_primes;

[export(case: "camelCase")]
micro count_primes(n: i64) -> i64 {
    let limit: usize = n as usize
    let mut primes: ArrayList<bool> = ArrayList::new(limit)
    let mut i: usize = 0
    while i < limit {
        primes.push(true)
        i = i + 1
    }
    let mut ans: i64 = 0
    i = 2
    while i < limit {
        if primes⁅i⁆ {
            ans = ans + 1
            let mut j: usize = i + i
            while j < limit {
                primes⁅j⁆ = false
                j = j + i
            }
        }
        i = i + 1
    }
    return ans
}

class Solution {
    micro countPrimes(self, n: i64): i64 {
        return count_primes(n)
    }
}
