namespace leetcode.valid_boomerang;

[export(case: "camelCase")]
micro is_boomerang(points: ArrayList<ArrayList<i64>>) -> bool {
    let p0: ArrayList<i64> = points⁅0⁆
    let p1: ArrayList<i64> = points⁅1⁆
    let p2: ArrayList<i64> = points⁅2⁆
    let x1: i64 = p0⁅0⁆
    let y1: i64 = p0⁅1⁆
    let x2: i64 = p1⁅0⁆
    let y2: i64 = p1⁅1⁆
    let x3: i64 = p2⁅0⁆
    let y3: i64 = p2⁅1⁆
    return (x2 - x1) * (y3 - y1) != (x3 - x1) * (y2 - y1)
}

class Solution {
    micro isBoomerang(self, points: ArrayList<ArrayList<i64>>): bool {
        return is_boomerang(points)
    }
}
