namespace leetcode.maximum_value_of_an_ordered_triplet_i;

using std.collection;

# 线性扫描维护最大左值与最大差，枚举第三个下标。
[export(case: "camelCase")]
micro maximumTripletValue(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = 0
    let mut best_left: i64 = nums⁅0⁆
    let mut best_diff: i64 = 0
    let mut index: usize = 1
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        let candidate: i64 = best_diff * value
        if candidate > best {
            best = candidate
        }
        let diff: i64 = best_left - value
        if diff > best_diff {
            best_diff = diff
        }
        if value > best_left {
            best_left = value
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro maximumTripletValue(self, nums: ArrayList<i64>): i64 {
        return maximumTripletValue(nums)
    }
}
