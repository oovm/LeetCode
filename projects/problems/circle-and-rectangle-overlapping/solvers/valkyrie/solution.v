namespace leetcode.circle_and_rectangle_overlapping;

micro clamp(v: i64, lo: i64, hi: i64) -> i64 {
    if v < lo {
        return lo
    }
    if v > hi {
        return hi
    }
    return v
}

# 圆心到矩形最近点距离² ≤ radius² 即相交。
[export(case: "camelCase")]
micro check_overlap(radius: i64, xCenter: i64, yCenter: i64, x1: i64, y1: i64, x2: i64, y2: i64) -> bool {
    let cx: i64 = clamp(xCenter, x1, x2)
    let cy: i64 = clamp(yCenter, y1, y2)
    let dx: i64 = xCenter - cx
    let dy: i64 = yCenter - cy
    return dx * dx + dy * dy <= radius * radius
}

class Solution {
    micro checkOverlap(self, radius: i64, xCenter: i64, yCenter: i64, x1: i64, y1: i64, x2: i64, y2: i64): bool {
        return check_overlap(radius, xCenter, yCenter, x1, y1, x2, y2)
    }
}
