namespace leetcode.widest_vertical_area_between_two_points_containing_no_points;

using std.collection;

micro compare_ascending(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 只取横坐标排序，相邻横坐标的最大间隔就是答案。
[export(case: "camelCase")]
micro maxWidthOfVerticalArea(points: ArrayList<ArrayList<i64>>) -> i64 {
    let mut abscissas: ArrayList<i64> = ArrayList::new(points.length())
    let mut position: usize = 0
    while position < points.length() {
        abscissas.push(points⁅position⁆⁅0⁆)
        position = position + 1
    }

    let ordered: ArrayList<i64> = sorted_by(abscissas, compare_ascending)
    let mut best: i64 = 0
    position = 1
    while position < ordered.length() {
        let gap: i64 = ordered⁅position⁆ - ordered⁅position - 1⁆
        if gap > best {
            best = gap
        }
        position = position + 1
    }
    return best
}

class Solution {
    micro maxWidthOfVerticalArea(self, points: ArrayList<ArrayList<i64>>): i64 {
        return maxWidthOfVerticalArea(points)
    }
}
