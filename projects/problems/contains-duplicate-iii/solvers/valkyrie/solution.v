namespace leetcode.contains_duplicate_iii;

using std.collection;

# 滑动窗口按值有序；`BTreeSet` 的 `floor` / `ceiling` 给出前驱与后继（G16 已提供）。
# 任一方向的距离落在 `valueDiff` 内即命中，不再物化 `to_list()` 快照或手写二分。
[export(case: "camelCase")]
micro contains_nearby_almost_duplicate(nums: ArrayList<i64>, indexDiff: i64, valueDiff: i64) -> bool {
    let span: usize = indexDiff as usize
    let mut window: BTreeSet<i64> = BTreeSet::new()
    let mut i: usize = 0
    while i < nums.length() {
        if i > span {
            window.remove(nums⁅i - span - 1⁆)
        }
        let value: i64 = nums⁅i⁆
        let below: Option<i64> = window.floor(value)
        if below.is_some() {
            if value - below.unwrap() <= valueDiff {
                return true
            }
        }
        let above: Option<i64> = window.ceiling(value)
        if above.is_some() {
            if above.unwrap() - value <= valueDiff {
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
