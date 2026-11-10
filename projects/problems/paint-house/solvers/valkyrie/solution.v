namespace leetcode.paint_house;

using std.collection;
using std.math;

# 三列滚动 DP：每列取另两列较小者加本格代价。O(n)。
[export(case: "camelCase")]
micro minCost(costs: ArrayList<ArrayList<i64>>) -> i64 {
    let n: usize = costs.length()
    if n == 0 {
        return 0
    }
    let mut prev0: i64 = costs⁅0⁆⁅0⁆
    let mut prev1: i64 = costs⁅0⁆⁅1⁆
    let mut prev2: i64 = costs⁅0⁆⁅2⁆
    let mut i: usize = 1
    while i < n {
        let next0: i64 = costs⁅i⁆⁅0⁆ + min(prev1, prev2)
        let next1: i64 = costs⁅i⁆⁅1⁆ + min(prev0, prev2)
        let next2: i64 = costs⁅i⁆⁅2⁆ + min(prev0, prev1)
        prev0 = next0
        prev1 = next1
        prev2 = next2
        i = i + 1
    }
    return min(min(prev0, prev1), prev2)
}

class Solution {
    micro minCost(self, costs: ArrayList<ArrayList<i64>>): i64 {
        return minCost(costs)
    }
}
