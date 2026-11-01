namespace leetcode.alternating_digit_sum;

[export(case: "camelCase")]
micro alternate_digit_sum(n: i64) -> i64 {
    let mut value: i64 = n
    let mut digit_count: i64 = 0
    let mut probe: i64 = n
    while probe > 0 {
        digit_count = digit_count + 1
        probe = probe / 10
    }
    let mut total: i64 = 0
    let mut digit_index: i64 = 1
    while value > 0 {
        let digit: i64 = value % 10
        if digit_index % 2 == 1 {
            total = total + digit
        } else {
            total = total - digit
        }
        value = value / 10
        digit_index = digit_index + 1
    }
    if digit_count % 2 == 0 {
        total = -total
    }
    return total
}

class Solution {
    micro alternateDigitSum(self, n: i64): i64 {
        return alternate_digit_sum(n)
    }
}
