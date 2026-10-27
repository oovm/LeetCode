namespace leetcode.min_cost_climbing_stairs;

class Solution {
    micro minCostClimbingStairs(self, cost: ArrayList<i64>): i64 {
        let mut f1: i64 = 0
        let mut f2: i64 = 0
        let mut i: usize = 1
        while i <= cost.length() {
            let c: i64 = cost⁅i⁆.unwrap()
            let min_val: i64 = f1
            if f2 < min_val {
                min_val = f2
            }
            f1 = f2
            f2 = min_val + c
            i = i + 1
        }
        if f1 < f2 {
            return f1
        }
        return f2
    }
}
