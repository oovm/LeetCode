namespace leetcode.contains_duplicate_iii;

using std.collection;

# 滑动窗口按值有序；BTreeSet 的约束应表达「有序」（T: Equal & Comparable），
# 当前 std 只写 T: Equal 却在内部裸调 <（G15）。
# BTreeSet 缺 floor / ceiling 两个界查询（G16），这里取 `to_list()` 升序快照后手写二分：
# `lower_bound` 给出首个 >= value 的位置，前驱即 floor、该位即 ceiling。
micro lower_bound(sorted: ArrayList<i64>, value: i64) -> usize {
    let mut lo: usize = 0
    let mut hi: usize = sorted.length()
    while lo < hi {
        let mid: usize = lo + (hi - lo) / 2
        if sorted⁅mid⁆ < value {
            lo = mid + 1
        } else {
            hi = mid
        }
    }
    return lo
}

[export(case: "camelCase")]
micro contains_nearby_almost_duplicate(nums: ArrayList<i64>, index_diff: i64, value_diff: i64) -> bool {
    let span: usize = index_diff as usize
    let mut window: BTreeSet<i64> = BTreeSet::new()
    let mut i: usize = 0
    while i < nums.length() {
        if i > span {
            window.remove(nums⁅i - span - 1⁆)
        }
        let value: i64 = nums⁅i⁆
        let sorted: ArrayList<i64> = window.to_list()
        let at: usize = lower_bound(sorted, value)
        if at > 0 {
            let below: i64 = sorted⁅at - 1⁆
            if value - below <= value_diff {
                return true
            }
        }
        if at < sorted.length() {
            let above: i64 = sorted⁅at⁆
            if above - value <= value_diff {
                return true
            }
        }
        window.insert(value)
        i = i + 1
    }
    return false
}

class Solution {
    micro containsNearbyAlmostDuplicate(self, nums: ArrayList<i64>, indexDiff: i64, valueDiff: i64): bool {
        return contains_nearby_almost_duplicate(nums, indexDiff, valueDiff)
    }
}
