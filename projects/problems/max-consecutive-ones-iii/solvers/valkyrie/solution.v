namespace leetcode.max_consecutive_ones_iii;

# 滑窗内的 0 至多 k 个：右端遇 0 计入，超出时左端退出，窗口长度即连续 1 的可翻转上限。
[export(case: "camelCase")]
micro longestOnes(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut zeros: i64 = 0
    let mut left: usize = 0
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < nums.length() {
        if nums⁅right⁆ == 0 {
            zeros = zeros + 1
        }
        while zeros > k {
            if nums⁅left⁆ == 0 {
                zeros = zeros - 1
            }
            left = left + 1
        }
        let window: i64 = right as i64 - left as i64 + 1
        if window > best {
            best = window
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro longestOnes(self, nums: ArrayList<i64>, k: i64): i64 {
        return longestOnes(nums, k)
    }
}
