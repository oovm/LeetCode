namespace leetcode.reverse_bits;

[export(case: "camelCase")]
micro reverse_bits(n: i64) -> i64 {
    let mut result: i64 = 0
    let mut value: i64 = n
    let mut i: i64 = 0
    while i < 32 {
        let bit: i64 = value.bit_and(1)
        result = result * 2 + bit
        value = value.bit_shift_right(1)
        i = i + 1
    }
    return result
}

class Solution {
    micro reverseBits(self, n: i64): i64 {
        return reverse_bits(n)
    }
}
