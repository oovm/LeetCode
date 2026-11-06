namespace leetcode.minimum_time_visiting_all_points;

using std.collection;

# 相邻两点之间按切比雪夫距离移动，累加即为最小时长。
[export(case: "camelCase")]
micro minTimeToVisitAllPoints(points: ArrayList<ArrayList<i64>>) -> i64 {
    let mut total: i64 = 0
    let mut position: usize = 1
    while position < points.length() {
        let dx: i64 = points⁅position⁆⁅0⁆ - points⁅position - 1⁆⁅0⁆
        let dy: i64 = points⁅position⁆⁅1⁆ - points⁅position - 1⁆⁅1⁆
        let mut adx: i64 = dx
        if dx < 0 {
            adx = 0 - dx
        }
        let mut ady: i64 = dy
        if dy < 0 {
            ady = 0 - dy
        }
        if adx > ady {
            total = total + adx
        } else {
            total = total + ady
        }
        position = position + 1
    }
    return total
}

class Solution {
    micro minTimeToVisitAllPoints(self, points: ArrayList<ArrayList<i64>>): i64 {
        return minTimeToVisitAllPoints(points)
    }
}
