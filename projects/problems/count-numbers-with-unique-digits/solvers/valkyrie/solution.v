namespace leetcode.count_numbers_with_unique_digits;

[export(case: "camelCase")]
micro count_numbers_with_unique_digits(n: i64) -> i64 {
    if n == 0 {
        return 1
    }
    let mut total: i64 = 10
    let mut unique: i64 = 9
    let mut digits: i64 = 1
    while digits < n {
        unique = unique * (10 - digits)
        total = total + unique
        digits = digits + 1
    }
    return total
}

class Solution {
    micro countNumbersWithUniqueDigits(self, n: i64): i64 {
        return count_numbers_with_unique_digits(n)
    }
}
