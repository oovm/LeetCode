namespace leetcode.k_closest_points_to_origin;

using std.collection;

micro distance_of(point: ArrayList<i64>) -> i64 {
    let x: i64 = point⁅0⁆
    let y: i64 = point⁅1⁆
    return x * x + y * y
}

# 距离升序；等距保持输入相对次序（`sorted_by` 稳定）。
micro compare_points(left: ArrayList<i64>, right: ArrayList<i64>) -> i32 {
    let left_distance: i64 = distance_of(left)
    let right_distance: i64 = distance_of(right)
    if left_distance < right_distance {
        return -1
    }
    if left_distance > right_distance {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro k_closest(points: ArrayList<ArrayList<i64>>, k: i64) -> ArrayList<ArrayList<i64>> {
    let ordered: ArrayList<ArrayList<i64>> = sorted_by(points, compare_points)
    let take: usize = k as usize
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(take)
    let mut index: usize = 0
    while index < take && index < ordered.length() {
        result.push(ordered⁅index⁆)
        index = index + 1
    }
    return result
}

class Solution {
    micro kClosest(self, points: ArrayList<ArrayList<i64>>, k: i64): ArrayList<ArrayList<i64>> {
        return k_closest(points, k)
    }
}
