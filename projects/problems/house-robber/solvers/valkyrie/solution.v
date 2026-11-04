namespace leetcode.house_robber;

# 打家劫舍：滚动保存「抢上一间」与「不抢上一间」两种最优值。
[export(case: "camelCase")]
micro rob(nums: ArrayList<i64>) -> i64 {
    let mut take: i64 = 0
    let mut skip: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        let x: i64 = nums⁅index⁆
        let next_take: i64 = skip + x
        let mut next_skip: i64 = skip
        if take > skip {
            next_skip = take
        }
        take = next_take
        skip = next_skip
        index = index + 1
    }
    if take > skip {
        return take
    }
    return skip
}

class Solution {
    micro rob(self, nums: ArrayList<i64>): i64 {
        return rob(nums)
    }
}
