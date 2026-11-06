namespace leetcode.maximum_difference_between_adjacent_elements_in_a_circular_array;

using std.collection;

# 首尾相接扫描相邻绝对差，取最大值。
[export(case: "camelCase")]
micro maxAdjacentDistance(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = 0
    let count: usize = nums.length()
    let mut index: usize = 0
    while index < count {
        let next_index: usize = (index + 1) % count
        let mut diff: i64 = nums⁅index⁆ - nums⁅next_index⁆
        if diff < 0 {
            diff = -diff
        }
        if diff > best {
            best = diff
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro maxAdjacentDistance(self, nums: ArrayList<i64>): i64 {
        return maxAdjacentDistance(nums)
    }
}
