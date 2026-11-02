namespace leetcode.smallest_number_with_all_set_bits;

[export(case: "camelCase")]
micro smallest_number(n: i64) -> i64 {
    let mut bits: i64 = 0
    let mut value: i64 = n
    while value > 0 {
        value = value / 2
        bits = bits + 1
    }
    let candidate: i64 = (1 << bits) - 1
    if candidate >= n {
        return candidate
    }
    return (1 << (bits + 1)) - 1
}

class Solution {
    micro smallestNumber(self, n: i64): i64 {
        return smallest_number(n)
    }
}
