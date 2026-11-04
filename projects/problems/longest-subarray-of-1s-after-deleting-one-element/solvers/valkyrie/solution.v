namespace leetcode.longest_subarray_of_1s_after_deleting_one_element;

# 滑窗内允许一个 0：窗口就是「删掉至多一个元素后连续 1」的可覆盖区间，答案要减去保留的那个位置。
[export(case: "camelCase")]
micro longestSubarray(nums: ArrayList<i64>) -> i64 {
    let mut zeros: i64 = 0
    let mut left: usize = 0
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < nums.length() {
        if nums⁅right⁆ == 0 {
            zeros = zeros + 1
        }
        while zeros > 1 {
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
    return best - 1
}

class Solution {
    micro longestSubarray(self, nums: ArrayList<i64>): i64 {
        return longestSubarray(nums)
    }
}
