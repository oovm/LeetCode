namespace leetcode.find_nearest_point_that_has_the_same_x_or_y_coordinate;

using std.collection;

# 只考虑与起点共享 x 或 y 的点，曼哈顿距离最小者胜，距离相同取下标更小者。
[export(case: "camelCase")]
micro nearestValidPoint(x: i64, y: i64, points: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = points.length()
    let mut answer: i64 = -1
    let mut best: i64 = -1
    let mut index: usize = 0
    while index < count {
        let point: ArrayList<i64> = points⁅index⁆
        let point_x: i64 = point⁅0⁆
        let point_y: i64 = point⁅1⁆
        if point_x == x || point_y == y {
            let mut distance: i64 = point_x - x
            if distance < 0 {
                distance = -distance
            }
            let mut vertical: i64 = point_y - y
            if vertical < 0 {
                vertical = -vertical
            }
            distance = distance + vertical
            if best < 0 || distance < best {
                best = distance
                answer = index as i64
            }
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro nearestValidPoint(self, x: i64, y: i64, points: ArrayList<ArrayList<i64>>): i64 {
        return nearestValidPoint(x, y, points)
    }
}
