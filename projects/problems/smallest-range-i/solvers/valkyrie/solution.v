namespace leetcode.smallest_range_i

# 只有最大值能被压低、最小值能被抬高，各最多变化 k，剩余差取 0 下限。
[export(case: "camelCase")]
micro smallestRangeI(nums: ArrayList<i64>, k: i64) -> i64 {
    let count: usize = nums.length()
    let zero: usize = 0
    let mut low: i64 = nums⁅zero⁆
    let mut high: i64 = nums⁅zero⁆
    let mut i: usize = 1
    while i < count {
        let value: i64 = nums⁅i⁆
        if value < low {
            low = value
        }
        if value > high {
            high = value
        }
        i = i + 1
    }
    let gap: i64 = high - low - 2 * k
    if gap < 0 {
        return 0
    }
    return gap
}

class Solution {
    micro smallestRangeI(self, nums: ArrayList<i64>, k: i64): i64 {
        return smallestRangeI(nums, k)
    }
}
