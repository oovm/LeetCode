namespace leetcode.minimum_cost_to_reach_every_position;

using std.collection;

# 前缀最小值即到达每个位置的最小花费。
[export(case: "camelCase")]
micro minCosts(cost: ArrayList<i64>) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(cost.length())
    let mut best: i64 = cost⁅0⁆
    let mut index: usize = 0
    while index < cost.length() {
        let value: i64 = cost⁅index⁆
        if value < best {
            best = value
        }
        result.push(best)
        index = index + 1
    }
    return result
}

class Solution {
    micro minCosts(self, cost: ArrayList<i64>): ArrayList<i64> {
        return minCosts(cost)
    }
}
