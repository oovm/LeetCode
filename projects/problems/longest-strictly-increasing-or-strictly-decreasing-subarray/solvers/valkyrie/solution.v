namespace leetcode.longest_strictly_increasing_or_strictly_decreasing_subarray;

using std.collection;

# 一遍扫描同时维护严格递增段与严格递减段的当前长度。
[export(case: "camelCase")]
micro longestMonotonicSubarray(nums: ArrayList<i64>) -> i64 {
    let mut answer: i64 = 1
    let mut increasing: i64 = 1
    let mut decreasing: i64 = 1
    let mut index: usize = 1
    while index < nums.length() {
        if nums⁅index - 1⁆ < nums⁅index⁆ {
            increasing = increasing + 1
        } else {
            increasing = 1
        }
        if nums⁅index - 1⁆ > nums⁅index⁆ {
            decreasing = decreasing + 1
        } else {
            decreasing = 1
        }
        if increasing > answer {
            answer = increasing
        }
        if decreasing > answer {
            answer = decreasing
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro longestMonotonicSubarray(self, nums: ArrayList<i64>): i64 {
        return longestMonotonicSubarray(nums)
    }
}
