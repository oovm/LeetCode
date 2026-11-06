namespace leetcode.minimum_operations_to_exceed_threshold_value_i;

using std.collection;

# 每个小于 k 的元素都需要被并掉一次。
[export(case: "camelCase")]
micro minOperations(nums: ArrayList<i64>, k: i64) -> i64 {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < count {
        if nums⁅index⁆ < k {
            total = total + 1
        }
        index = index + 1
    }
    return total
}

class Solution {
    micro minOperations(self, nums: ArrayList<i64>, k: i64): i64 {
        return minOperations(nums, k)
    }
}
