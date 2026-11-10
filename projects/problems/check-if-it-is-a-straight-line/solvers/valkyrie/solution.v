namespace leetcode.check_if_it_is_a_straight_line;

using std.collection;

# 叉积判共线：所有点与首两点的叉积为 0 即共线，避免除法与斜率特判。
[export(case: "camelCase")]
micro checkStraightLine(coordinates: ArrayList<ArrayList<i64>>) -> bool {
    let x0: i64 = coordinates⁅0⁆⁅0⁆
    let y0: i64 = coordinates⁅0⁆⁅1⁆
    let dx: i64 = coordinates⁅1⁆⁅0⁆ - x0
    let dy: i64 = coordinates⁅1⁆⁅1⁆ - y0
    let mut index: usize = 2
    while index < coordinates.length() {
        let cross: i64 = dx * (coordinates⁅index⁆⁅1⁆ - y0) - dy * (coordinates⁅index⁆⁅0⁆ - x0)
        if cross != 0 {
            return false
        }
        index = index + 1
    }
    return true
}

class Solution {
    micro checkStraightLine(self, coordinates: ArrayList<ArrayList<i64>>): bool {
        return checkStraightLine(coordinates)
    }
}
