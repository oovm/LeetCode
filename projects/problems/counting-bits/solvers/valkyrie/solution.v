namespace leetcode.counting_bits;

[export(case: "camelCase")]
micro count_bits(n: i64) -> [i64] {
    let mut result: ArrayList<i64> = ArrayList::new((n + 1) as usize)
    let mut v: i64 = 0
    while v <= n {
        let mut c: i64 = 0
        let mut value: i64 = v
        while value > 0 {
            c = c + value.bit_and(1)
            value = value.bit_shift_right(1)
        }
        result.push(c)
        v = v + 1
    }
    return result.to_array()
}

class Solution {
    micro countBits(self, n: i64): [i64] {
        return count_bits(n)
    }
}
