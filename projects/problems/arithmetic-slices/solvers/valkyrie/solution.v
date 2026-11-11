namespace leetcode.arithmetic_slices;

# 统计连续等差段：长度为 len 的等差段贡献 len-1 个等差子数组。
[export(case: "camelCase")]
micro number_of_arithmetic_slices(nums: [i64]) -> i64 {
    let n: usize = nums.length()
    let mut total: i64 = 0
    let mut run: i64 = 0
    let mut i: usize = 2
    while i < n {
        let current: i64 = nums⁅i⁆
        let middle: i64 = nums⁅i - 1⁆
        let before: i64 = nums⁅i - 2⁆
        if current - middle == middle - before {
            run = run + 1
            total = total + run
        } else {
            run = 0
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro numberOfArithmeticSlices(self, nums: [i64]): i64 {
        return number_of_arithmetic_slices(nums)
    }
}
