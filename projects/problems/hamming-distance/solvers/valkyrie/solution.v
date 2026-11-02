namespace leetcode.hamming_distance;

[export(case: "camelCase")]
micro hamming_distance(x: i64, y: i64) -> i64 {
    let mut count: i64 = 0
    let mut a: i64 = x
    let mut b: i64 = y
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
    micro hammingDistance(self, x: i64, y: i64): i64 {
        return hamming_distance(x, y)
    }
}
