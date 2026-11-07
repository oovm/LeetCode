namespace leetcode.number_of_1_bits;

[export(case: "camelCase")]
micro hamming_weight(n: i64) -> i64 {
    return n.count_ones() as i64
}

class Solution {
    micro hammingWeight(self, n: i64): i64 {
        return hamming_weight(n)
    }
}
