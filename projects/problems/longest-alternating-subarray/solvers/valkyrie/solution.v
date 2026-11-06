namespace leetcode.longest_alternating_subarray;

using std.collection;

# 从每个相邻 +1 的起点向后扩展交替段，取最长长度，无则 -1。
[export(case: "camelCase")]
micro alternatingSubarray(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = -1
    let mut index: usize = 0
    while index + 1 < nums.length() {
        if nums⁅index + 1⁆ - nums⁅index⁆ == 1 {
            let mut end: usize = index + 1
            while end + 1 < nums.length() && nums⁅end + 1⁆ == nums⁅end - 1⁆ {
                end = end + 1
            }
            let length: i64 = (end - index + 1) as i64
            if length > best {
                best = length
            }
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro alternatingSubarray(self, nums: ArrayList<i64>): i64 {
        return alternatingSubarray(nums)
    }
}
