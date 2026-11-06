namespace leetcode.longest_even_odd_subarray_with_threshold;

using std.collection;

# 以每个「偶数且不超过阈值」的位置为起点向右扩展，要求奇偶交替且全程不超阈值。
[export(case: "camelCase")]
micro longestAlternatingSubarray(nums: ArrayList<i64>, threshold: i64) -> i64 {
    let mut answer: i64 = 0
    let mut left: usize = 0
    while left < nums.length() {
        if nums⁅left⁆ % 2 == 0 && nums⁅left⁆ <= threshold {
            let mut right: usize = left + 1
            while right < nums.length() {
                let previous_even: bool = nums⁅right - 1⁆ % 2 == 0
                let current_even: bool = nums⁅right⁆ % 2 == 0
                if previous_even == current_even {
                    break
                }
                if nums⁅right⁆ > threshold {
                    break
                }
                right = right + 1
            }
            let length: i64 = (right - left) as i64
            if length > answer {
                answer = length
            }
        }
        left = left + 1
    }
    return answer
}

class Solution {
    micro longestAlternatingSubarray(self, nums: ArrayList<i64>, threshold: i64): i64 {
        return longestAlternatingSubarray(nums, threshold)
    }
}
