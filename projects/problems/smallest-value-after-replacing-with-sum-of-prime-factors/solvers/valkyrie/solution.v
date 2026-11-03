namespace leetcode.smallest_value_after_replacing_with_sum_of_prime_factors;

micro prime_factor_sum(x: i64) -> i64 {
    let mut sum: i64 = 0
    let mut rest: i64 = x
    let mut d: i64 = 2
    while d * d <= rest {
        while rest % d == 0 {
            sum = sum + d
            rest = rest / d
        }
        d = d + 1
    }
    if rest > 1 {
        sum = sum + rest
    }
    return sum
}

# 迭代到不动点（质数即自身）。
[export(case: "camelCase")]
micro smallest_value(n: i64) -> i64 {
    let mut current: i64 = n
    while true {
        let next: i64 = prime_factor_sum(current)
        if next == current {
            return current
        }
        current = next
    }
    return 0
}

class Solution {
    micro smallestValue(self, n: i64): i64 {
        return smallest_value(n)
    }
}
