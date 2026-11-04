namespace leetcode.maximum_gap;

using std.collection;

# 定长载体排序：Array<T> 在 sort.v 里是 0 个排序入口，理想入口应与 ArrayList 同名（G11）。
# 排序后只读扫描用 ArrayView，避免复制。
[export(case: "camelCase")]
micro maximum_gap(nums: [i64]) -> i64 {
    sort(nums)
    let window: ArrayView<i64> = array_view(nums)
    let count: usize = window.length()
    if count < 2 {
        return 0
    }

    let mut best: i64 = 0
    let mut i: usize = 1
    while i < count {
        let gap: i64 = window⁅i⁆ - window⁅i - 1⁆
        if gap > best {
            best = gap
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maximumGap(self, nums: [i64]): i64 {
        return maximum_gap(nums)
    }
}
