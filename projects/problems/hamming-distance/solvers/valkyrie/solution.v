namespace leetcode.hamming_distance;

[export(case: "camelCase")]
micro hamming_distance(x: i64, y: i64) -> i64 {
    let diff: i64 = x.bit_xor(y)
    return diff.count_ones() as i64
}

class Solution {
    micro hammingDistance(self, x: i64, y: i64): i64 {
        return hamming_distance(x, y)
    }
}
