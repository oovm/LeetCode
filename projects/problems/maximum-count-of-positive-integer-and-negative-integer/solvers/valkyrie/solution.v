namespace leetcode.maximum_count_of_positive_integer_and_negative_integer

# 分别统计正数与非负数中的零以外的负数个数，返回较大者。
[export(case: "camelCase")]
micro maximumCount(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut positive: i64 = 0
    let mut negative: i64 = 0
    let mut i: usize = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        if value > 0 {
            positive = positive + 1
        }
        if value < 0 {
            negative = negative + 1
        }
        i = i + 1
    }
    if positive > negative {
        return positive
    }
    return negative
}

class Solution {
    micro maximumCount(self, nums: ArrayList<i64>): i64 {
        return maximumCount(nums)
    }
}
