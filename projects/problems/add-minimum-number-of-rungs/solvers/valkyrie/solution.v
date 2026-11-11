namespace leetcode.solution

using std.collection

# 相邻两阶之间，每段空隙最多跨 `dist`，需要补的阶数就是 `(gap - 1) / dist`（向下取整）。
class Solution {
    [export(case: "camelCase")]
    micro addRungs(rungs: [i64], dist: i64) -> i64 {
        let mut previous: i64 = 0
        let mut total: i64 = 0
        loop rung in rungs {
            let gap: i64 = rung - previous
            total = total + (gap - 1) / dist
            previous = rung
        }
        return total
    }
}
