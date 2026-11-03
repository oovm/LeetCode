namespace leetcode.house_robber_ii;

micro rob_range(nums: ArrayList<i64>, start: usize, end: usize) -> i64 {
    let mut take: i64 = 0
    let mut skip: i64 = 0
    let mut i: usize = start
    while i < end {
        let x: i64 = nums⁅i⁆
        let next_take: i64 = skip + x
        let mut next_skip: i64 = skip
        if take > skip {
            next_skip = take
        }
        take = next_take
        skip = next_skip
        i = i + 1
    }
    if take > skip {
        return take
    }
    return skip
}

# 环状排列拆成「不含最后一间」与「不含第一间」两条链。
[export(case: "camelCase")]
micro rob(nums: ArrayList<i64>) -> i64 {
    let n: usize = nums.length()
    if n == 1 {
        return nums⁅0⁆
    }
    let without_last: i64 = rob_range(nums, 0, n - 1)
    let without_first: i64 = rob_range(nums, 1, n)
    if without_last > without_first {
        return without_last
    }
    return without_first
}

class Solution {
    micro rob(self, nums: ArrayList<i64>): i64 {
        return rob(nums)
    }
}
