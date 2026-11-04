namespace leetcode.remove_covered_intervals;

using std.collection;

# 起点升序、同起点终点降序后单次扫描：一个区间被覆盖，当且仅当它的终点不超过此前最大终点。
# 题内触发点: G11 —— `std.collection.sort` 没有返回新序列的 `sorted_by`，
# 只能先把输入拷进副本，再 `merge_sort(ordered, compare_interval)` 就地排序。
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

    let mut ordered: ArrayList<ArrayList<i64>> = ArrayList::new(count)
    loop interval in intervals {
        ordered.push(interval)
    }
    merge_sort(ordered, compare_interval)

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
