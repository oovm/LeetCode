namespace leetcode.integer_break;

[export(case: "camelCase")]
micro integer_break(n: i64) -> i64 {
    if n <= 3 {
        return n - 1
    }
    let mut threes: i64 = n / 3
    let mut remainder: i64 = n % 3
    if remainder == 1 {
        threes = threes - 1
        remainder = 4
    }
    let mut product: i64 = 1
    let mut i: i64 = 0
    while i < threes {
        product = product * 3
        i = i + 1
    }
    if remainder == 0 {
        return product
    }
    return product * remainder
}

class Solution {
    micro integerBreak(self, n: i64): i64 {
        return integer_break(n)
    }
}
