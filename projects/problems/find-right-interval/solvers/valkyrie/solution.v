namespace leetcode.find_right_interval;

using std.collection;

# 以每个区间的起点为键建有序表（值 = 原下标），再对每个区间的终点做一次下界查询：
# 「最小且 >= 终点的起点」就是右区间，越界即 -1。
# 题内触发点: G16 —— `BTreeMap` 只有插入 / 精确 `get` / 全量 `keys()`，
# 没有任何按值定位的界查询（`ceiling` / `floor`）。理想写法是一次 O(log n) 定位，
# 而不是 `keys()` 全量物化后手写二分。
[export(case: "camelCase")]
micro find_right_interval(intervals: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let count: usize = intervals.length()
    let mut starts: BTreeMap<i64, i64> = BTreeMap::new(count)
    let mut i: usize = 0
    while i < count {
        let span: ArrayList<i64> = intervals⁅i⁆
        starts.insert(span⁅0⁆, i as i64)
        i = i + 1
    }

    let mut result: ArrayList<i64> = ArrayList::new(count)
    i = 0
    while i < count {
        let span: ArrayList<i64> = intervals⁅i⁆
        let end: i64 = span⁅1⁆
        let upper: Option<i64> = starts.ceiling_key(end)
        if upper.is_some() {
            let index: i64 = starts.get(upper.unwrap()).unwrap()
            result.push(index)
        } else {
            result.push(-1)
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro findRightInterval(self, intervals: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return find_right_interval(intervals)
    }
}
