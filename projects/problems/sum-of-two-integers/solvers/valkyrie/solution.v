namespace leetcode.sum_of_two_integers;

[export(case: "camelCase")]
micro get_sum(a: i64, b: i64) -> i64 {
    let mut x: i64 = a
    let mut y: i64 = b
    while y != 0 {
        let carry: i64 = x.bit_and(y) * 2
        x = x.bit_xor(y)
        y = carry
    }
    return x
}

class Solution {
    micro getSum(self, a: i64, b: i64): i64 {
        return get_sum(a, b)
    }
}
