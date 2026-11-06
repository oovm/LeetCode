namespace leetcode.find_target_indices_after_sorting_array;

using std.collection;

# 排序后 target 占据 [小于个数, 小于个数+等于个数) 区间。
[export(case: "camelCase")]
micro targetIndices(nums: ArrayList<i64>, target: i64) -> ArrayList<i64> {
    let mut less: i64 = 0
    let mut equal: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if value < target {
            less = less + 1
        }
        if value == target {
            equal = equal + 1
        }
        index = index + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(equal as usize)
    let mut offset: i64 = 0
    while offset < equal {
        result.push(less + offset)
        offset = offset + 1
    }
    return result
}

class Solution {
    micro targetIndices(self, nums: ArrayList<i64>, target: i64): ArrayList<i64> {
        return targetIndices(nums, target)
    }
}
