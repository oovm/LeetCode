namespace leetcode.richest_customer_wealth;

using std.collection;

# 逐行求和取最大值。
[export(case: "camelCase")]
micro maximumWealth(accounts: ArrayList<ArrayList<i64>>) -> i64 {
    let mut best: i64 = 0
    let mut row: usize = 0
    while row < accounts.length() {
        let mut total: i64 = 0
        let mut column: usize = 0
        while column < accounts⁅row⁆.length() {
            total = total + accounts⁅row⁆⁅column⁆
            column = column + 1
        }
        if total > best {
            best = total
        }
        row = row + 1
    }
    return best
}

class Solution {
    micro maximumWealth(self, accounts: ArrayList<ArrayList<i64>>): i64 {
        return maximumWealth(accounts)
    }
}
