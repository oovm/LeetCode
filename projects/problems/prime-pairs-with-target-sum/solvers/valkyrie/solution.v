namespace leetcode.prime_pairs_with_target_sum;

micro build_sieve(limit: i64) -> ArrayList<bool> {
    let mut prime: ArrayList<bool> = ArrayList::new((limit + 1) as usize)
    let mut i: i64 = 0
    while i <= limit {
        prime.push(true)
        i = i + 1
    }
    if limit >= 0 {
        prime⁅0⁆ = false
    }
    if limit >= 1 {
        prime⁅1⁆ = false
    }
    let mut factor: i64 = 2
    while factor * factor <= limit {
        if prime⁅factor as usize⁆ {
            let mut multiple: i64 = factor * factor
            while multiple <= limit {
                prime⁅multiple as usize⁆ = false
                multiple = multiple + factor
            }
        }
        factor = factor + 1
    }
    return prime
}

# 枚举 a <= b 且 a + b = n 的素数对，按 a 升序输出。
[export(case: "camelCase")]
micro find_prime_pairs(n: i64) -> [[i64]] {
    let prime: ArrayList<bool> = build_sieve(n)
    let mut answer: ArrayList<[i64]> = ArrayList::new(0)
    let mut a: i64 = 2
    while a <= n / 2 {
        if prime⁅a as usize⁆ && prime⁅(n - a) as usize⁆ {
            let mut pair: ArrayList<i64> = ArrayList::new(2)
            pair.push(a)
            pair.push(n - a)
            answer.push(pair.to_array())
        }
        a = a + 1
    }
    return answer.to_array()
}

class Solution {
    micro findPrimePairs(self, n: i64): [[i64]] {
        return find_prime_pairs(n)
    }
}
