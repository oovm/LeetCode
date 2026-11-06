namespace leetcode.create_target_array_in_the_given_order;

using std.collection;

# 按 index 逐个插入到目标序列的指定位置。
[export(case: "camelCase")]
micro createTargetArray(nums: ArrayList<i64>, index: ArrayList<i64>) -> ArrayList<i64> {
    let mut target: ArrayList<i64> = ArrayList::new(nums.length())
    let mut position: usize = 0
    while position < nums.length() {
        let mut slot: usize = index⁅position⁆ as usize
        if slot > target.length() {
            slot = target.length()
        }
        target.push(0)
        let mut cursor: usize = target.length() - 1
        while cursor > slot {
            target⁅cursor⁆ = target⁅cursor - 1⁆
            cursor = cursor - 1
        }
        target⁅slot⁆ = nums⁅position⁆
        position = position + 1
    }
    return target
}

class Solution {
    micro createTargetArray(self, nums: ArrayList<i64>, index: ArrayList<i64>): ArrayList<i64> {
        return createTargetArray(nums, index)
    }
}
