namespace leetcode.binary_number_with_alternating_bits;

[export(case: "camelCase")]
micro has_alternating_bits(n: i64) -> bool {
    let mut num: i64 = n
    let mut prev: i64 = num.bit_and(1)
    num = num.bit_shift_right(1)
    while num > 0 {
        let current: i64 = num.bit_and(1)
        if current == prev {
            return false
        }
        prev = current
        num = num.bit_shift_right(1)
    }
    return true
}

class Solution {
    micro hasAlternatingBits(self, n: i64): bool {
        return has_alternating_bits(n)
    }
}
