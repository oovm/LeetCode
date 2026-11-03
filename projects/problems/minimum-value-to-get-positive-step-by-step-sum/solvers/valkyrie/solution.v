namespace leetcode.minimum_value_to_get_positive_step_by_step_sum;

[export(case: "camelCase")]
micro min_start_value(nums: ArrayList<i64>) -> i64 {
    let mut sum: i64 = 0
    let mut lowest: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        sum = sum + nums⁅i⁆
        if sum < lowest {
            lowest = sum
        }
        i = i + 1
    }
    return 1 - lowest
}

class Solution {
    micro minStartValue(self, nums: ArrayList<i64>): i64 {
        return min_start_value(nums)
    }
}
