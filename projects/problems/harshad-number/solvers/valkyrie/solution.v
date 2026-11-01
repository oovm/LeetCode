namespace leetcode.harshad_number;

micro digit_total(value: i64) -> i64 {
    let mut remaining: i64 = value
    let mut total: i64 = 0
    while remaining > 0 {
        total = total + remaining % 10
        remaining = remaining / 10
    }
    return total
}

[export(case: "camelCase")]
micro sum_of_the_digits_of_harshad_number(x: i64) -> i64 {
    let total: i64 = digit_total(x)
    if x % total == 0 {
        return total
    }
    return -1
}

class Solution {
    micro sumOfTheDigitsOfHarshadNumber(self, x: i64): i64 {
        return sum_of_the_digits_of_harshad_number(x)
    }
}
