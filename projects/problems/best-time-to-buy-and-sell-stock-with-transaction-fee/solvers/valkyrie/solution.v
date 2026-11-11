namespace leetcode.best_time_to_buy_and_sell_stock_with_transaction_fee;

using std.collection;

# 两个状态滚动：`cash` 为不持股的最大收益，`hold` 为持股的最大收益。
# 每次卖出只扣一次手续费，保持 O(n) 一趟。
[export(case: "camelCase")]
micro maxProfit(prices: [i64], fee: i64) -> i64 {
    let mut cash: i64 = 0
    let mut hold: i64 = 0 - prices⁅0⁆
    let mut i: usize = 1
    while i < prices.length() {
        let price: i64 = prices⁅i⁆
        if hold + price - fee > cash {
            cash = hold + price - fee
        }
        if cash - price > hold {
            hold = cash - price
        }
        i = i + 1
    }
    return cash
}

class Solution {
    micro maxProfit(self, prices: [i64], fee: i64): i64 {
        return maxProfit(prices, fee)
    }
}
