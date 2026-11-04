namespace leetcode.smallest_index_with_equal_value

# 从前往后找第一个满足 i mod 10 == nums[i] 的下标。
[export(case: "camelCase")]
micro smallestEqual(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut i: usize = 0
    while i < count {
        let digit: i64 = (i % 10) as i64
        if digit == nums⁅i⁆ {
            return i as i64
        }
        i = i + 1
    }
    return -1
}

class Solution {
    micro smallestEqual(self, nums: ArrayList<i64>): i64 {
        return smallestEqual(nums)
    }
}
