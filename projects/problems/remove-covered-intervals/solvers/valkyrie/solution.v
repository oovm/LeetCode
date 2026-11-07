namespace leetcode.remove_covered_intervals;

using std.collection;

# 起点升序、同起点终点降序后单次扫描：一个区间被覆盖，当且仅当它的终点不超过此前最大终点。
# 排序走 `sorted_by`：返回新序列，不改动入参，不再手写副本 + 就地排序。
micro compare_interval(a: ArrayList<i64>, b: ArrayList<i64>) -> i32 {
    if a⁅0⁆ < b⁅0⁆ {
        return -1
    }
    if a⁅0⁆ > b⁅0⁆ {
        return 1
    }
    if a⁅1⁆ > b⁅1⁆ {
        return -1
    }
    if a⁅1⁆ < b⁅1⁆ {
        return 1
    }
    return 0
}

[export(case: "camelCase")]
micro remove_covered_intervals(intervals: ArrayList<ArrayList<i64>>) -> i64 {
    let count: usize = intervals.length()
    if count == 0 {
        return 0
    }

    let ordered: ArrayList<ArrayList<i64>> = sorted_by(intervals, compare_interval)

    let head: ArrayList<i64> = ordered⁅0⁆
    let mut reach: i64 = head⁅1⁆
    let mut kept: i64 = 1
    let mut index: usize = 1
    while index < ordered.length() {
        let interval: ArrayList<i64> = ordered⁅index⁆
        if interval⁅1⁆ > reach {
            reach = interval⁅1⁆
            kept = kept + 1
        }
        index = index + 1
    }
    return kept
}

class Solution {
    micro removeCoveredIntervals(self, intervals: ArrayList<ArrayList<i64>>): i64 {
        return remove_covered_intervals(intervals)
    }
}
