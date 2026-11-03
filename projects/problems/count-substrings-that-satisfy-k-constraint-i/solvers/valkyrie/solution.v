namespace leetcode.count_substrings_that_satisfy_k_constraint_i;

# 滑窗：两计数都超过 k 时才收缩左界，右界每次计入窗内全部结尾子串。
[export(case: "camelCase")]
micro count_k_constraint_substrings(s: utf8, k: i64) -> i64 {
    let n: usize = s.length()
    let mut zeros: i64 = 0
    let mut ones: i64 = 0
    let mut left: usize = 0
    let mut right: usize = 0
    let mut total: i64 = 0
    while right < n {
        if (s⁅right⁆ as u32) == 48 {
            zeros = zeros + 1
        } else {
            ones = ones + 1
        }
        while zeros > k && ones > k {
            if (s⁅left⁆ as u32) == 48 {
                zeros = zeros - 1
            } else {
                ones = ones - 1
            }
            left = left + 1
        }
        total = total + (right - left + 1) as i64
        right = right + 1
    }
    return total
}

class Solution {
    micro countKConstraintSubstrings(self, s: utf8, k: i64): i64 {
        return count_k_constraint_substrings(s, k)
    }
}
