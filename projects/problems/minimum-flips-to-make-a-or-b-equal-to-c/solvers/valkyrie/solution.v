namespace leetcode.minimum_flips_to_make_a_or_b_equal_to_c;

[export(case: "camelCase")]
micro min_flips(a: i64, b: i64, c: i64) -> i64 {
    let mut count: i64 = 0
    let mut x: i64 = a
    let mut y: i64 = b
    let mut z: i64 = c
    while x > 0 || y > 0 || z > 0 {
        let bit_a: i64 = x.bit_and(1)
        let bit_b: i64 = y.bit_and(1)
        let bit_c: i64 = z.bit_and(1)
        if bit_c == 0 {
            count = count + bit_a + bit_b
        } else {
            if bit_a == 0 && bit_b == 0 {
                count = count + 1
            }
        }
        x = x.bit_shift_right(1)
        y = y.bit_shift_right(1)
        z = z.bit_shift_right(1)
    }
    return count
}

class Solution {
    micro minFlips(self, a: i64, b: i64, c: i64): i64 {
        return min_flips(a, b, c)
    }
}
