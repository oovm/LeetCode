namespace leetcode.sum_multiples;

[export(case: "camelCase")]
micro sum_of_multiples(n: i64) -> i64 {
    let mut total: i64 = 0
    let mut value: i64 = 1
    while value <= n {
        if value % 3 == 0 || value % 5 == 0 || value % 7 == 0 {
            total = total + value
        }
        value = value + 1
    }
    return total
}

class Solution {
    micro sumOfMultiples(self, n: i64): i64 {
        return sum_of_multiples(n)
    }
}
