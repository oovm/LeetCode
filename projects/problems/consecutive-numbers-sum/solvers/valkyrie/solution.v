namespace leetcode.consecutive_numbers_sum;

[export(case: "camelCase")]
micro consecutive_numbers_sum(n: i64) -> i64 {
    let mut count: i64 = 0
    let mut length: i64 = 1
    while length * (length + 1) / 2 <= n {
        let excess: i64 = n - length * (length + 1) / 2
        if excess % length == 0 {
            count = count + 1
        }
        length = length + 1
    }
    return count
}

class Solution {
    micro consecutiveNumbersSum(self, n: i64): i64 {
        return consecutive_numbers_sum(n)
    }
}
