namespace leetcode.count_subarrays_of_length_three_with_a_condition;

using std.collection;

# 统计长度为 3 且 2*(首+尾) == 中间的子数组。
[export(case: "camelCase")]
micro countSubarrays(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut index: usize = 0
    while index + 2 < nums.length() {
        if 2 * (nums⁅index⁆ + nums⁅index + 2⁆) == nums⁅index + 1⁆ {
            total = total + 1
        }
        index = index + 1
    }
    return total
}

class Solution {
    micro countSubarrays(self, nums: ArrayList<i64>): i64 {
        return countSubarrays(nums)
    }
}
