namespace leetcode.buy_two_chocolates;

using std.collection;

micro compare_ascending(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 买最便宜的两块，钱不够就一分不花。
[export(case: "camelCase")]
micro buyChoco(prices: ArrayList<i64>, money: i64) -> i64 {
    let ordered: ArrayList<i64> = sorted_by(prices, compare_ascending)
    let cost: i64 = ordered⁅0⁆ + ordered⁅1⁆
    if cost > money {
        return money
    }
    return money - cost
}

class Solution {
    micro buyChoco(self, prices: ArrayList<i64>, money: i64): i64 {
        return buyChoco(prices, money)
    }
}
