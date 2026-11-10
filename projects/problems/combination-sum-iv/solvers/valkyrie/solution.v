namespace leetcode.combination_sum_iv;

using std.collection;

# 完全排列计数：dp[t] 累加所有可达的 dp[t - x]，按目标值递推。
[export(case: "camelCase")]
micro combinationSum4(nums: ArrayList<i64>, target: i64) -> i64 {
    let mut dp: ArrayList<i64> = ArrayList::new(target as usize + 1)
    let mut slot: i64 = 0
    while slot <= target {
        dp.push(0)
        slot = slot + 1
    }
    dp⁅0⁆ = 1
    let mut total: i64 = 1
    while total <= target {
        let mut sum: i64 = 0
        loop value in nums {
            if value <= total {
                sum = sum + dp⁅(total - value) as usize⁆
            }
        }
        dp⁅total as usize⁆ = sum
        total = total + 1
    }
    return dp⁅target as usize⁆
}

class Solution {
    micro combinationSum4(self, nums: ArrayList<i64>, target: i64): i64 {
        return combinationSum4(nums, target)
    }
}
