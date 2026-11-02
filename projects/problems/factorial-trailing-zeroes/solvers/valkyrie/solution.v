namespace leetcode.factorial_trailing_zeroes;

[export(case: "camelCase")]
micro trailing_zeroes(n: i64) -> i64 {
    let mut count: i64 = 0
    let mut power: i64 = 5
    while power <= n {
        count = count + n / power
        power = power * 5
    }
    return count
}

class Solution {
    micro trailingZeroes(self, n: i64): i64 {
        return trailing_zeroes(n)
    }
}
