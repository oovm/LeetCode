namespace leetcode.find_right_interval;

using std.collection;

# 以每个区间的起点为键建有序表（值 = 原下标），再对每个区间的终点做一次下界查询：
# 「最小且 >= 终点的起点」就是右区间，越界即 -1；`ceiling_key` 直接给出该键（G16 已提供），
# 不再全量物化 `keys()` 后手写二分。
[export(case: "camelCase")]
micro find_right_interval(intervals: [[i64]]) -> [i64] {
    let count: usize = intervals.length()
    let mut starts: BTreeMap<i64, i64> = BTreeMap::new(count)
    let mut i: usize = 0
    while i < count {
        let span: [i64] = intervals⁅i⁆
        starts.insert(span⁅0⁆, i as i64)
        i = i + 1
    }

    let mut result: ArrayList<i64> = ArrayList::new(count)
    i = 0
    while i < count {
        let span: [i64] = intervals⁅i⁆
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
    return result.to_array()
}

class Solution {
    micro findRightInterval(self, intervals: [[i64]]): [i64] {
        return find_right_interval(intervals)
    }
}
