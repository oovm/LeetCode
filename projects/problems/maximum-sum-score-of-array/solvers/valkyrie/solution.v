namespace leetcode.maximum_sum_score_of_array;

using std.collection;

# 前缀和 / 后缀和同步推进：left 为 nums[0..i]，right 为 nums[i..n-1]。
[export(case: "camelCase")]
micro maximumSumScore(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut cursor: usize = 0
    while cursor < nums.length() {
        total = total + nums⁅cursor⁆
        cursor = cursor + 1
    }

    let mut left: i64 = 0
    let mut right: i64 = total
    let mut best: i64 = nums⁅0⁆
    let mut i: usize = 0
    while i < nums.length() {
        left = left + nums⁅i⁆
        if left > best {
            best = left
        }
        if right > best {
            best = right
        }
        right = right - nums⁅i⁆
        i = i + 1
    }
    return best
}

class Solution {
    micro maximumSumScore(self, nums: ArrayList<i64>): i64 {
        return maximumSumScore(nums)
    }
}
