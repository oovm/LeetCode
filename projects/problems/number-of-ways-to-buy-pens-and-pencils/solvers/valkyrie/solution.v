namespace leetcode.number_of_ways_to_buy_pens_and_pencils;

# Σ_{i=0}^{⌊total/cost1⌋} (1 + ⌊(total - i·cost1)/cost2⌋)。
[export(case: "camelCase")]
micro ways_to_buy_pens_pencils(total: i64, cost1: i64, cost2: i64) -> i64 {
    let mut ways: i64 = 0
    let mut pens: i64 = 0
    while pens * cost1 <= total {
        ways = ways + (total - pens * cost1) / cost2 + 1
        pens = pens + 1
    }
    return ways
}

class Solution {
    micro waysToBuyPensPencils(self, total: i64, cost1: i64, cost2: i64): i64 {
        return ways_to_buy_pens_pencils(total, cost1, cost2)
    }
}
