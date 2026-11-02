namespace leetcode.bitwise_and_of_numbers_range;

[export(case: "camelCase")]
micro range_bitwise_and(left: i64, right: i64) -> i64 {
    let mut l: i64 = left
    let mut r: i64 = right
    let mut shift: i64 = 0
    while l < r {
        l = l.bit_shift_right(1)
        r = r.bit_shift_right(1)
        shift = shift + 1
    }
    while shift > 0 {
        l = l * 2
        shift = shift - 1
    }
    return l
}

class Solution {
    micro rangeBitwiseAnd(self, left: i64, right: i64): i64 {
        return range_bitwise_and(left, right)
    }
}
