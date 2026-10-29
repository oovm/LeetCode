namespace leetcode.armstrong_number;

[export(case: "camelCase")]
micro is_armstrong(n: i64) -> bool {
    let mut num: i64 = n
    let mut digit_count: i64 = 0
    if num == 0 {
        return true
    }
    while num > 0 {
        digit_count = digit_count + 1
        num = num / 10
    }
    num = n
    let mut sum: i64 = 0
    while num > 0 {
        let digit: i64 = num % 10
        let mut power: i64 = 1
        let mut i: i64 = 0
        while i < digit_count {
            power = power * digit
            i = i + 1
        }
        sum = sum + power
        num = num / 10
    }
    return sum == n
}

class Solution {
    micro isArmstrong(self, n: i64): bool {
        return is_armstrong(n)
    }
}
