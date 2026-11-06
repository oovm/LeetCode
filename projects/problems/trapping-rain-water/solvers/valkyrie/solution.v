namespace leetcode.solution

using std.collection

class Solution {
    [export(case: "camelCase")]
    micro trap(height: ArrayList<i64>) -> i64 {
        let total: usize = height.length()
        if total == 0 {
            return 0
        }
        let mut left: usize = 0
        let mut right: usize = total - 1
        let mut left_max: i64 = 0
        let mut right_max: i64 = 0
        let mut water: i64 = 0
        while left < right {
            if height⁅left⁆ <= height⁅right⁆ {
                if height⁅left⁆ >= left_max {
                    left_max = height⁅left⁆
                } else {
                    water = water + (left_max - height⁅left⁆)
                }
                left = left + 1
            } else {
                if height⁅right⁆ >= right_max {
                    right_max = height⁅right⁆
                } else {
                    water = water + (right_max - height⁅right⁆)
                }
                right = right - 1
            }
        }
        return water
    }
}
