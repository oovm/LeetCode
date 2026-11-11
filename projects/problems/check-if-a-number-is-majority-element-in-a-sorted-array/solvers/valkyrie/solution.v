namespace leetcode.check_if_a_number_is_majority_element_in_a_sorted_array;

using std.collection;

# 有序数组二分：求 target 首次出现下标，计数 = 末次 - 首次 + 1 与 n/2 比较。
micro first_at_least(nums: ArrayList<i64>, target: i64) -> usize {
    let mut lo: usize = 0
    let mut hi: usize = nums.length()
    while lo < hi {
        let mid: usize = (lo + hi) / 2
        if nums⁅mid⁆ >= target {
            hi = mid
        } else {
            lo = mid + 1
        }
    }
    return lo
}

[export(case: "camelCase")]
micro isMajorityElement(nums: ArrayList<i64>, target: i64) -> bool {
    let first: usize = first_at_least(nums, target)
    let last: usize = first_at_least(nums, target + 1)
    return last - first > nums.length() / 2
}

class Solution {
    micro isMajorityElement(self, nums: ArrayList<i64>, target: i64): bool {
        return isMajorityElement(nums, target)
    }
}
