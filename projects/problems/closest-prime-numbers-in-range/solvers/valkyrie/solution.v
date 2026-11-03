namespace leetcode.closest_prime_numbers_in_range;

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

# 扫描区间内相邻素数的间隔，取最小间隔的一对。
[export(case: "camelCase")]
micro closest_primes(left: i64, right: i64) -> ArrayList<i64> {
    let prime: ArrayList<bool> = build_sieve(right)
    let mut previous: i64 = -1
    let mut best_gap: i64 = 0
    let mut first: i64 = -1
    let mut second: i64 = -1
    let mut value: i64 = left
    while value <= right {
        if prime⁅value as usize⁆ {
            if previous >= 0 {
                let gap: i64 = value - previous
                if best_gap == 0 || gap < best_gap {
                    best_gap = gap
                    first = previous
                    second = value
                }
            }
            previous = value
        }
        value = value + 1
    }
    let mut answer: ArrayList<i64> = ArrayList::new(2)
    answer.push(first)
    answer.push(second)
    return answer
}

class Solution {
    micro closestPrimes(self, left: i64, right: i64): ArrayList<i64> {
        return closest_primes(left, right)
    }
}
