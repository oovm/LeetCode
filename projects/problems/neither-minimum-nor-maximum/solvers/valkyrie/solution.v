namespace leetcode.neither_minimum_nor_maximum;

using std.collection;

# 返回第一个既非全局最小也非全局最大的元素；不足 3 个返回 -1。
[export(case: "camelCase")]
micro findNonMinOrMax(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    if count < 3 {
        return -1
    }
    let mut low: i64 = nums⁅0⁆
    let mut high: i64 = nums⁅0⁆
    let mut index: usize = 1
    while index < count {
        let value: i64 = nums⁅index⁆
        if value < low {
            low = value
        }
        if value > high {
            high = value
        }
        index = index + 1
    }
    index = 0
    while index < count {
        let value: i64 = nums⁅index⁆
        if value != low && value != high {
            return value
        }
        index = index + 1
    }
    return -1
}

class Solution {
    micro findNonMinOrMax(self, nums: ArrayList<i64>): i64 {
        return findNonMinOrMax(nums)
    }
}
