namespace leetcode.check_if_array_is_sorted_and_rotated;

using std.collection;

# 有序且至多旋转一次，等价于环形相邻下降次数不超过一。
[export(case: "camelCase")]
micro check(nums: [i64]) -> bool {
    let count: usize = nums.length()
    if count == 0 {
        return true
    }
    let mut drops: i64 = 0
    let mut index: usize = 0
    while index < count {
        let next: usize = (index + 1) % count
        if nums⁅index⁆ > nums⁅next⁆ {
            drops = drops + 1
        }
        index = index + 1
    }
    return drops <= 1
}

class Solution {
    micro check(self, nums: [i64]): bool {
        return check(nums)
    }
}
