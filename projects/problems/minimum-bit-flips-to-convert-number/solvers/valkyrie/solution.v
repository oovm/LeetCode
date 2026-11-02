namespace leetcode.minimum_bit_flips_to_convert_number;

[export(case: "camelCase")]
micro min_bit_flips(start: i64, goal: i64) -> i64 {
    let mut count: i64 = 0
    let mut a: i64 = start
    let mut b: i64 = goal
    while a > 0 || b > 0 {
        let bit_a: i64 = a.bit_and(1)
        let bit_b: i64 = b.bit_and(1)
        if bit_a != bit_b {
            count = count + 1
        }
        a = a.bit_shift_right(1)
        b = b.bit_shift_right(1)
    }
    return count
}

class Solution {
    micro minBitFlips(self, start: i64, goal: i64): i64 {
        return min_bit_flips(start, goal)
    }
}
