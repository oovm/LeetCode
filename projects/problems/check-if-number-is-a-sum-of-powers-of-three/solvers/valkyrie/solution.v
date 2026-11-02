namespace leetcode.check_if_number_is_a_sum_of_powers_of_three;

[export(case: "camelCase")]
micro check_powers_of_three(n: i64) -> bool {
    let mut x: i64 = n
    while x > 0 {
        if x % 3 == 2 {
            return false
        }
        x = x / 3
    }
    return true
}

class Solution {
    micro checkPowersOfThree(self, n: i64): bool {
        return check_powers_of_three(n)
    }
}
