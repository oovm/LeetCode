namespace leetcode.binary_gap;

[export(case: "camelCase")]
micro binary_gap(n: i64) -> i64 {
    let ones: i64 = n.count_ones() as i64
    if ones < 2 {
        return 0
    }
    let mut num: i64 = n.bit_shift_right(n.trailing_zeros() as i64)
    let mut max_zeros: i64 = 0
    while num > 1 {
        num = num.bit_shift_right(1)
        let gap: i64 = num.trailing_zeros() as i64
        if gap > max_zeros {
            max_zeros = gap
        }
        num = num.bit_shift_right(gap)
    }
    return max_zeros + 1
}

class Solution {
    micro binaryGap(self, n: i64): i64 {
        return binary_gap(n)
    }
}
