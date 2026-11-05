namespace leetcode.minimum_cost_for_tickets;

using std.collection;

# `dp[i]` 表示覆盖前 i 天的最小花费。7 天 / 30 天窗口用两个只前进的指针定位
# 起点，避免二分，整体 O(n)。
[export(case: "camelCase")]
micro mincostTickets(days: ArrayList<i64>, costs: ArrayList<i64>) -> i64 {
    let count: usize = days.length()
    let mut dp: ArrayList<i64> = ArrayList::new(count + 1)
    dp.push(0)
    let mut first7: usize = 0
    let mut first30: usize = 0
    let mut i: usize = 0
    while i < count {
        let day: i64 = days⁅i⁆
        while day - days⁅first7⁆ >= 7 {
            first7 = first7 + 1
        }
        while day - days⁅first30⁆ >= 30 {
            first30 = first30 + 1
        }
        let one: i64 = dp⁅i⁆ + costs⁅0⁆
        let seven: i64 = dp⁅first7⁆ + costs⁅1⁆
        let thirty: i64 = dp⁅first30⁆ + costs⁅2⁆
        let mut best: i64 = one
        if seven < best {
            best = seven
        }
        if thirty < best {
            best = thirty
        }
        dp.push(best)
        i = i + 1
    }
    return dp⁅count⁆
}

class Solution {
    micro mincostTickets(self, days: ArrayList<i64>, costs: ArrayList<i64>): i64 {
        return mincostTickets(days, costs)
    }
}
