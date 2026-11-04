namespace leetcode.best_time_to_buy_and_sell_stock;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
[export(case: "camelCase")]
micro max_profit(prices: ArrayList<i64>) -> i64 {
    let mut min_price: i64 = 9223372036854775807
    let mut max_profit: i64 = 0
    let mut i: usize = 0
    while i < prices.length() {
        let price: i64 = prices⁅i⁆
        if price < min_price {
            min_price = price
        }
        let profit: i64 = price - min_price
        if profit > max_profit {
            max_profit = profit
        }
        i = i + 1
    }
    return max_profit
}

class Solution {
    micro maxProfit(self, prices: ArrayList<i64>): i64 {
        return max_profit(prices)
    }
}
