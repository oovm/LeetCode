namespace leetcode.coin_change;

# 完全背包：dp[a] 为凑出金额 a 的最少硬币数，-1 表示不可达。
[export(case: "camelCase")]
micro coin_change(coins: [i64], amount: i64) -> i64 {
    let mut dp: ArrayList<i64> = ArrayList::new((amount + 1) as usize)
    let mut a: i64 = 0
    while a <= amount {
        dp.push(-1)
        a = a + 1
    }
    dp⁅0⁆ = 0
    a = 1
    while a <= amount {
        loop coin in coins {
            if coin <= a {
                let rest: i64 = dp⁅(a - coin) as usize⁆
                if rest >= 0 {
                    let candidate: i64 = rest + 1
                    let current: i64 = dp⁅a as usize⁆
                    if current < 0 || candidate < current {
                        dp⁅a as usize⁆ = candidate
                    }
                }
            }
        }
        a = a + 1
    }
    return dp⁅amount as usize⁆
}

class Solution {
    micro coinChange(self, coins: [i64], amount: i64): i64 {
        return coin_change(coins, amount)
    }
}
