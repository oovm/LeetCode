namespace leetcode.smallest_range_ii;

using std.collection;

micro cmp_i64(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 排序后枚举分界：左侧全加 k、右侧全减 k 时，区间端点只由两侧边界决定。
# 取所有分界中的最小跨度，O(n log n) 全在排序上。
[export(case: "camelCase")]
micro smallest_range_ii(mut nums: ArrayList<i64>, k: i64) -> i64 {
    let n: usize = nums.length()
    if n <= 1 {
        return 0
    }
    quick_sort(nums, cmp_i64)
    let mut best: i64 = nums⁅n - 1⁆ - nums⁅0⁆
    let mut split: usize = 1
    while split < n {
        let raised: i64 = nums⁅0⁆ + k
        let lowered: i64 = nums⁅split⁆ - k
        let mut low: i64 = raised
        if lowered < low {
            low = lowered
        }
        let high_left: i64 = nums⁅split - 1⁆ + k
        let high_right: i64 = nums⁅n - 1⁆ - k
        let mut high: i64 = high_left
        if high_right > high {
            high = high_right
        }
        let span: i64 = high - low
        if span < best {
            best = span
        }
        split = split + 1
    }
    return best
}

class Solution {
    micro smallestRangeII(self, nums: ArrayList<i64>, k: i64): i64 {
        return smallest_range_ii(nums, k)
    }
}
