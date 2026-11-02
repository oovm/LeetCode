namespace leetcode.a_number_after_a_double_reversal;

[export(case: "camelCase")]
micro is_same_after_reversals(num: i64) -> bool {
    if num == 0 {
        return true
    }
    return num % 10 != 0
}

class Solution {
    micro isSameAfterReversals(self, num: i64): bool {
        return is_same_after_reversals(num)
    }
}
