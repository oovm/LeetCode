namespace leetcode.maximum_ascending_subarray_sum

# 连续上升则累加，否则从当前元素重新起段，过程中记录最大段和。
[export(case: "camelCase")]
micro maxAscendingSum(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let zero: usize = 0
    let mut best: i64 = nums⁅zero⁆
    let mut current: i64 = nums⁅zero⁆
    let mut i: usize = 1
    while i < count {
        let value: i64 = nums⁅i⁆
        let previous: usize = i - 1
        if value > nums⁅previous⁆ {
            current = current + value
        }
        if value <= nums⁅previous⁆ {
            current = value
        }
        if current > best {
            best = current
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maxAscendingSum(self, nums: ArrayList<i64>): i64 {
        return maxAscendingSum(nums)
    }
}
