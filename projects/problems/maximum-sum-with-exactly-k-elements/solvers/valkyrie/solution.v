namespace leetcode.maximum_sum_with_exactly_k_elements;

using std.collection;

# 每次把当前最大值加一，k 次后的总和为 max * k + k * (k - 1) / 2。
[export(case: "camelCase")]
micro maximizeSum(nums: ArrayList<i64>, k: i64) -> i64 {
    let count: usize = nums.length()
    let mut largest: i64 = nums⁅0⁆
    let mut index: usize = 1
    while index < count {
        let value: i64 = nums⁅index⁆
        if value > largest {
            largest = value
        }
        index = index + 1
    }
    return largest * k + k * (k - 1) / 2
}

class Solution {
    micro maximizeSum(self, nums: ArrayList<i64>, k: i64): i64 {
        return maximizeSum(nums, k)
    }
}
