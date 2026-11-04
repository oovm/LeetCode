namespace leetcode.contains_duplicate_iii;

using std.collection;

# 滑动窗口按值有序；BTreeSet 的约束应表达「有序」（T: Equal & Comparable），
# 当前 std 只写 T: Equal 却在内部裸调 <（G15）。
[export(case: "camelCase")]
micro contains_nearby_almost_duplicate(nums: ArrayList<i64>, index_diff: i64, value_diff: i64) -> bool {
    let span: usize = index_diff as usize
    # 判定只需窗口内的前驱/后继，BTreeSet 缺 floor / ceiling 两个界查询（G16）。
    let mut window: BTreeSet<i64> = BTreeSet::new()
    let mut i: usize = 0
    while i < nums.length() {
        if i > span {
            window.remove(nums⁅i - span - 1⁆)
        }
        let value: i64 = nums⁅i⁆
        let below: Option<i64> = window.floor(value)
        if below.is_some() && value - below.unwrap() <= value_diff {
            return true
        }
        let above: Option<i64> = window.ceiling(value)
        if above.is_some() && above.unwrap() - value <= value_diff {
            return true
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
