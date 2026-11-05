namespace leetcode.valid_square;

using std.collection;

# 四点中任取三个，两条相等且非零的邻边与一条等于它们之和的对角线即构成直角；
# 四个三元组都成立就是正方形。常数次距离计算，O(1)。
micro squared(a: ArrayList<i64>, b: ArrayList<i64>) -> i64 {
    let dx: i64 = a⁅0⁆ - b⁅0⁆
    let dy: i64 = a⁅1⁆ - b⁅1⁆
    return dx * dx + dy * dy
}

micro right_angle(a: ArrayList<i64>, b: ArrayList<i64>, c: ArrayList<i64>) -> bool {
    let d1: i64 = squared(a, b)
    let d2: i64 = squared(a, c)
    let d3: i64 = squared(b, c)
    if d1 == d2 && d1 + d2 == d3 && d1 != 0 {
        return true
    }
    if d2 == d3 && d2 + d3 == d1 && d2 != 0 {
        return true
    }
    if d1 == d3 && d1 + d3 == d2 && d1 != 0 {
        return true
    }
    return false
}

[export(case: "camelCase")]
micro valid_square(p1: ArrayList<i64>, p2: ArrayList<i64>, p3: ArrayList<i64>, p4: ArrayList<i64>) -> bool {
    if !right_angle(p1, p2, p3) {
        return false
    }
    if !right_angle(p2, p3, p4) {
        return false
    }
    if !right_angle(p1, p3, p4) {
        return false
    }
    return right_angle(p1, p2, p4)
}

class Solution {
    micro validSquare(self, p1: ArrayList<i64>, p2: ArrayList<i64>, p3: ArrayList<i64>, p4: ArrayList<i64>): bool {
        return valid_square(p1, p2, p3, p4)
    }
}
