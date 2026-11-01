namespace leetcode.count_integers_with_even_digit_sum;

micro has_even_digit_sum(value: i64) -> bool {
    let mut num: i64 = value
    let mut sum: i64 = 0
    while num > 0 {
        sum = sum + num % 10
        num = num / 10
    }
    return sum % 2 == 0
}

[export(case: "camelCase")]
micro count_even(num: i64) -> i64 {
    let mut count: i64 = 0
    let mut value: i64 = 1
    while value <= num {
        if has_even_digit_sum(value) {
            count = count + 1
        }
        value = value + 1
    }
    return count
}

class Solution {
    micro countEven(self, num: i64): i64 {
        return count_even(num)
    }
}
