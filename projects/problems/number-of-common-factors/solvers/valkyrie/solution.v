namespace leetcode.number_of_common_factors;

[export(case: "camelCase")]
micro common_factors(a: i64, b: i64) -> i64 {
    let mut count: i64 = 0
    let mut factor: i64 = 1
    while factor <= a && factor <= b {
        if a % factor == 0 && b % factor == 0 {
            count = count + 1
        }
        factor = factor + 1
    }
    return count
}

class Solution {
    micro commonFactors(self, a: i64, b: i64): i64 {
        return common_factors(a, b)
    }
}
