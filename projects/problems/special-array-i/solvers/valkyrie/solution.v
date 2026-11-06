namespace leetcode.special_array_i;

using std.collection;

# 特殊数组：所有相邻元素奇偶性都不同。
[export(case: "camelCase")]
micro isArraySpecial(nums: ArrayList<i64>) -> bool {
    let count: usize = nums.length()
    let mut index: usize = 1
    while index < count {
        let previous: i64 = nums⁅index - 1⁆ % 2
        let current: i64 = nums⁅index⁆ % 2
        if previous == current {
            return false
        }
        index = index + 1
    }
    return true
}

class Solution {
    micro isArraySpecial(self, nums: ArrayList<i64>): bool {
        return isArraySpecial(nums)
    }
}
