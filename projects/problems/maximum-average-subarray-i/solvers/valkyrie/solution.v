namespace leetcode.maximum_average_subarray_i;

using std.collection;

# 定窗和最大即最大均值；均值可能非整，按 f64 返回（G2 / G3 面）。
# 题内触发点: findMaxAverage 返回 `f64`（`best / k` 含非整商），归 G2 / G3 面。
[export(case: "camelCase")]
micro findMaxAverage(nums: ArrayList<i64>, k: i64) -> f64 {
    let width: usize = k as usize
    let mut sum: i64 = 0
    let mut index: usize = 0
    while index < width {
        sum = sum + nums⁅index⁆
        index = index + 1
    }
    let mut best: i64 = sum
    while index < nums.length() {
        sum = sum + nums⁅index⁆ - nums⁅index - width⁆
        if sum > best {
            best = sum
        }
        index = index + 1
    }
    return (best as f64) / (k as f64)
}

class Solution {
    micro findMaxAverage(self, nums: ArrayList<i64>, k: i64): f64 {
        return findMaxAverage(nums, k)
    }
}
