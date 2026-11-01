namespace leetcode.number_of_digit_one;

[export(case: "camelCase")]
micro count_digit_one(n: i64) -> i64 {
    let mut total: i64 = 0
    let mut digit_place: i64 = 1
    let mut iteration: i64 = 0
    while iteration < 12 {
        let higher: i64 = n / (digit_place * 10)
        let digit: i64 = (n / digit_place) % 10
        let lower: i64 = n % digit_place
        if digit == 0 {
            total = total + higher * digit_place
        }
        if digit == 1 {
            total = total + higher * digit_place + lower + 1
        }
        if digit > 1 {
            total = total + (higher + 1) * digit_place
        }
        digit_place = digit_place * 10
        iteration = iteration + 1
    }
    return total
}

class Solution {
    micro countDigitOne(self, n: i64): i64 {
        return count_digit_one(n)
    }
}
