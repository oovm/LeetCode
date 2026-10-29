namespace leetcode.perfect_number;

[export(case: "camelCase")]
micro check_perfect_number(num: i64) -> bool {
    if num <= 1 {
        return false
    }
    let mut sum: i64 = 1
    let mut i: i64 = 2
    while i * i <= num {
        if num % i == 0 {
            sum = sum + i
            let other: i64 = num / i
            if other != i {
                sum = sum + other
            }
        }
        i = i + 1
    }
    return sum == num
}

class Solution {
    micro checkPerfectNumber(self, num: i64): bool {
        return check_perfect_number(num)
    }
}
