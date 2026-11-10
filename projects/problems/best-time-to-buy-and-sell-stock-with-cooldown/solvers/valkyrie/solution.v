namespace leetcode.best_time_to_buy_and_sell_stock_with_cooldown;

using std.collection;
using std.math;

# 状态机 DP：hold / sold / rest 三态逐日转移；卖出次日强制冷却经 rest 走 sold 前值。
[export(case: "camelCase")]
micro maxProfit(prices: ArrayList<i64>) -> i64 {
    let n: usize = prices.length()
    if n == 0 {
        return 0
    }
    let mut hold: i64 = 0 - prices⁅0⁆
    let mut sold: i64 = 0
    let mut rest: i64 = 0
    let mut i: usize = 1
    while i < n {
        let prev_hold: i64 = hold
        let prev_sold: i64 = sold
        hold = max(hold, rest - prices⁅i⁆)
        sold = prev_hold + prices⁅i⁆
        rest = max(rest, prev_sold)
        i = i + 1
    }
    return max(sold, rest)
}

class Solution {
    micro maxProfit(self, prices: ArrayList<i64>): i64 {
        return maxProfit(prices)
    }
}
