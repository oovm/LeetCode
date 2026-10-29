namespace leetcode.power_of_four;

[export(case: "camelCase")]
micro is_power_of_four(n: i64) -> bool {
    if n <= 0 {
        return false
    }
    let mut num: i64 = n
    while num > 1 {
        if num % 4 != 0 {
            return false
        }
        num = num / 4
    }
    return true
}

class Solution {
    micro isPowerOfFour(self, n: i64): bool {
        return is_power_of_four(n)
    }
}
