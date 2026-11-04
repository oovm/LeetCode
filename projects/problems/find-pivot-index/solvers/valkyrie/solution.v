namespace leetcode.find_pivot_index

# 先求总和，再从左累加，判断左侧和等于右侧和（总和减左和减当前元素）。
[export(case: "camelCase")]
micro pivotIndex(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < count {
        total = total + nums⁅i⁆
        i = i + 1
    }

    let mut left: i64 = 0
    let mut index: usize = 0
    while index < count {
        let current: i64 = nums⁅index⁆
        if left == total - left - current {
            return index as i64
        }
        left = left + current
        index = index + 1
    }
    return -1
}

class Solution {
    micro pivotIndex(self, nums: ArrayList<i64>): i64 {
        return pivotIndex(nums)
    }
}
