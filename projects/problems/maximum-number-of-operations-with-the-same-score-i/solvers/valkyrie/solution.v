namespace leetcode.maximum_number_of_operations_with_the_same_score_i;

using std.collection;

# 以首两个元素之和为目标，从下标 2 起每两个一组计数。
[export(case: "camelCase")]
micro maxOperations(nums: ArrayList<i64>) -> i64 {
    if nums.length() < 2 {
        return 0
    }
    let target: i64 = nums⁅0⁆ + nums⁅1⁆
    let mut total: i64 = 1
    let mut index: usize = 2
    while index + 1 < nums.length() {
        if nums⁅index⁆ + nums⁅index + 1⁆ != target {
            break
        }
        total = total + 1
        index = index + 2
    }
    return total
}

class Solution {
    micro maxOperations(self, nums: ArrayList<i64>): i64 {
        return maxOperations(nums)
    }
}
