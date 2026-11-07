namespace leetcode.minimum_bit_flips_to_convert_number;

[export(case: "camelCase")]
micro min_bit_flips(start: i64, goal: i64) -> i64 {
    let diff: i64 = start.bit_xor(goal)
    return diff.count_ones() as i64
}

class Solution {
    micro minBitFlips(self, start: i64, goal: i64): i64 {
        return min_bit_flips(start, goal)
    }
}
