namespace leetcode.count_the_digits_that_divide_a_number;

[export(case: "camelCase")]
micro count_digits(num: i64) -> i64 {
    let mut value: i64 = num
    let mut counter: i64 = 0
    while value > 0 {
        let digit: i64 = value % 10
        if digit != 0 && num % digit == 0 {
            counter = counter + 1
        }
        value = value / 10
    }
    return counter
}

class Solution {
    micro countDigits(self, num: i64): i64 {
        return count_digits(num)
    }
}
