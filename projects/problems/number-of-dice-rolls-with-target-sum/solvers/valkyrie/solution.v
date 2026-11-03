namespace leetcode.number_of_dice_rolls_with_target_sum;

# 逐次投掷滚动 DP：dp[s] 为掷出总和 s 的方案数。
[export(case: "camelCase")]
micro num_rolls_to_target(n: i64, k: i64, target: i64) -> i64 {
    let modulus: i64 = 1000000007
    let mut dp: ArrayList<i64> = ArrayList::new((target + 1) as usize)
    let mut s: i64 = 0
    while s <= target {
        dp.push(0)
        s = s + 1
    }
    dp⁅0⁆ = 1
    let mut roll: i64 = 0
    while roll < n {
        let mut next: ArrayList<i64> = ArrayList::new((target + 1) as usize)
        s = 0
        while s <= target {
            next.push(0)
            s = s + 1
        }
        s = 0
        while s <= target {
            let mut face: i64 = 1
            while face <= k {
                if s >= face {
                    next⁅s as usize⁆ = (next⁅s as usize⁆.unwrap() + dp⁅(s - face) as usize⁆.unwrap()) % modulus
                }
                face = face + 1
            }
            s = s + 1
        }
        dp = next
        roll = roll + 1
    }
    return dp⁅target as usize⁆.unwrap()
}

class Solution {
    micro numRollsToTarget(self, n: i64, k: i64, target: i64): i64 {
        return num_rolls_to_target(n, k, target)
    }
}
