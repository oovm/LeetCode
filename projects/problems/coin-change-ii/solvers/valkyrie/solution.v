namespace leetcode.coin_change_ii;

using std.collection;

# 组合数 DP：外层逐硬币、内层升序金额，dp[a] += dp[a - coin]，天然去排列重复。
[export(case: "camelCase")]
micro change(amount: i64, coins: [i64]) -> i64 {
    let mut dp: ArrayList<i64> = ArrayList::new(amount as usize + 1)
    let mut slot: i64 = 0
    while slot <= amount {
        dp.push(0)
        slot = slot + 1
    }
    dp⁅0⁆ = 1
    loop coin in coins {
        let mut a: usize = coin as usize
        while a <= amount as usize {
            dp⁅a⁆ = dp⁅a⁆ + dp⁅a - coin as usize⁆
            a = a + 1
        }
    }
    return dp⁅amount as usize⁆
}

class Solution {
    micro change(self, amount: i64, coins: [i64]): i64 {
        return change(amount, coins)
    }
}
