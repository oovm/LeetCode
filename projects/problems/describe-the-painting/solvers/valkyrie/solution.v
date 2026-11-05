namespace leetcode.describe_the_painting;

using std.collection;

# 命中已知阻断面 BTreeMap / `Comparable` 义务：`deltas.contains_key(start)` /
# `deltas.insert(...)` / `deltas.get(...)` 全部无法解析（见账本 R30 映射）。
# 真写法就是下面的差分 + 有序键扫描；还原判据是 `BTreeMap<i64, i64>` 成员调用可解析。
# 本文件保持为阻断标记，不作为可用实现。
[export(case: "camelCase")]
micro splitPainting(segments: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let mut deltas: BTreeMap<i64, i64> = BTreeMap::new(segments.length() * 2)
    let mut index: usize = 0
    while index < segments.length() {
        let segment: ArrayList<i64> = segments⁅index⁆
        let start: i64 = segment⁅0⁆
        let end: i64 = segment⁅1⁆
        let color: i64 = segment⁅2⁆
        if deltas.contains_key(start) {
            deltas.insert(start, deltas.get(start).unwrap() + color)
        } else {
            deltas.insert(start, color)
        }
        if deltas.contains_key(end) {
            deltas.insert(end, deltas.get(end).unwrap() - color)
        } else {
            deltas.insert(end, -color)
        }
        index = index + 1
    }

    let points: ArrayList<i64> = deltas.keys()
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(points.length())
    let mut running: i64 = 0
    let mut i: usize = 0
    while i + 1 < points.length() {
        let start: i64 = points⁅i⁆
        let end: i64 = points⁅i + 1⁆
        running = running + deltas.get(start).unwrap()
        if running != 0 {
            let mut row: ArrayList<i64> = ArrayList::new(3)
            row.push(start)
            row.push(end)
            row.push(running)
            result.push(row)
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro splitPainting(self, segments: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return splitPainting(segments)
    }
}
