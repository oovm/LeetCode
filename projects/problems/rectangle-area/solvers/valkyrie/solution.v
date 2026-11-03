namespace leetcode.rectangle_area;

micro max_of(a: i64, b: i64) -> i64 {
    if a > b {
        return a
    }
    return b
}

micro min_of(a: i64, b: i64) -> i64 {
    if a < b {
        return a
    }
    return b
}

[export(case: "camelCase")]
micro compute_area(ax1: i64, ay1: i64, ax2: i64, ay2: i64, bx1: i64, by1: i64, bx2: i64, by2: i64) -> i64 {
    let area_a: i64 = (ax2 - ax1) * (ay2 - ay1)
    let area_b: i64 = (bx2 - bx1) * (by2 - by1)
    let overlap_w: i64 = min_of(ax2, bx2) - max_of(ax1, bx1)
    let overlap_h: i64 = min_of(ay2, by2) - max_of(ay1, by1)
    if overlap_w > 0 && overlap_h > 0 {
        return area_a + area_b - overlap_w * overlap_h
    }
    return area_a + area_b
}

class Solution {
    micro computeArea(self, ax1: i64, ay1: i64, ax2: i64, ay2: i64, bx1: i64, by1: i64, bx2: i64, by2: i64): i64 {
        return compute_area(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2)
    }
}
