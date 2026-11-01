namespace leetcode.complement_of_base_10_integer;

[export(case: "camelCase")]
micro bitwise_complement(n: i64) -> i64 {
    let mut mask: i64 = 1
    let mut value: i64 = n
    while value > 1 {
        mask = mask * 2 + 1
        value = value / 2
    }
    return mask - n
}

class Solution {
    micro bitwiseComplement(self, n: i64): i64 {
        return bitwise_complement(n)
    }
}
