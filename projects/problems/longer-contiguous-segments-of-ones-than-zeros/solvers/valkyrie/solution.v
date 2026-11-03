namespace leetcode.longer_contiguous_segments_of_ones_than_zeros;

[export(case: "camelCase")]
micro check_zero_ones(s: utf8) -> bool {
    let n: usize = s.length()
    let mut max_ones: i64 = 0
    let mut max_zeros: i64 = 0
    let mut run_ones: i64 = 0
    let mut run_zeros: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: i64 = s⁅i⁆ as u32 as i64
        if code == 49 {
            run_ones = run_ones + 1
            run_zeros = 0
        } else {
            run_zeros = run_zeros + 1
            run_ones = 0
        }
        if run_ones > max_ones {
            max_ones = run_ones
        }
        if run_zeros > max_zeros {
            max_zeros = run_zeros
        }
        i = i + 1
    }
    return max_ones > max_zeros
}

class Solution {
    micro checkZeroOnes(self, s: utf8): bool {
        return check_zero_ones(s)
    }
}
