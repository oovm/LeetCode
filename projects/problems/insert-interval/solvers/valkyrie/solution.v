namespace leetcode.insert_interval;

using std.collection;

# 三段线性：先照抄右界小于新段左界的区间，再吞并所有重叠区间扩界，最后照抄剩余。O(n)。
[export(case: "camelCase")]
micro insert(intervals: ArrayList<ArrayList<i64>>, newInterval: ArrayList<i64>) -> ArrayList<ArrayList<i64>> {
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    let n: usize = intervals.length()
    let mut start: i64 = newInterval⁅0⁆
    let mut end: i64 = newInterval⁅1⁆
    let mut i: usize = 0
    while i < n && intervals⁅i⁆⁅1⁆ < start {
        let mut row: ArrayList<i64> = ArrayList::new(2)
        row.push(intervals⁅i⁆⁅0⁆)
        row.push(intervals⁅i⁆⁅1⁆)
        out.push(row)
        i = i + 1
    }
    while i < n && intervals⁅i⁆⁅0⁆ <= end {
        if intervals⁅i⁆⁅0⁆ < start {
            start = intervals⁅i⁆⁅0⁆
        }
        if intervals⁅i⁆⁅1⁆ > end {
            end = intervals⁅i⁆⁅1⁆
        }
        i = i + 1
    }
    let mut merged: ArrayList<i64> = ArrayList::new(2)
    merged.push(start)
    merged.push(end)
    out.push(merged)
    while i < n {
        let mut row: ArrayList<i64> = ArrayList::new(2)
        row.push(intervals⁅i⁆⁅0⁆)
        row.push(intervals⁅i⁆⁅1⁆)
        out.push(row)
        i = i + 1
    }
    return out
}

class Solution {
    micro insert(self, intervals: ArrayList<ArrayList<i64>>, newInterval: ArrayList<i64>): ArrayList<ArrayList<i64>> {
        return insert(intervals, newInterval)
    }
}
