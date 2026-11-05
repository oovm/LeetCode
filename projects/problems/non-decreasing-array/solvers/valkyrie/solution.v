namespace leetcode.non_decreasing_array;

using std.collection;

# 至多允许一次下降：遇到下降就记一次，若再遇到第二次则失败。
# 单次下降时，若前前元素仍大于当前元素，只能把当前元素抬高到前一个元素。
[export(case: "camelCase")]
micro checkPossibility(nums: ArrayList<i64>) -> bool {
    let mut changed: bool = false
    let mut i: usize = 1
    while i < nums.length() {
        if nums⁅i - 1⁆ > nums⁅i⁆ {
            if changed {
                return false
            }
            changed = true
            if i >= 2 && nums⁅i - 2⁆ > nums⁅i⁆ {
                nums⁅i⁆ = nums⁅i - 1⁆
            }
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro checkPossibility(self, nums: ArrayList<i64>): bool {
        return checkPossibility(nums)
    }
}
