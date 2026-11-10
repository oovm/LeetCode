namespace leetcode.minimum_common_value;

using std.collection;

# 两有序数组双指针同步前进，首个相等值即最小公共值。
[export(case: "camelCase")]
micro getCommon(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> i64 {
    let mut i: usize = 0
    let mut j: usize = 0
    while i < nums1.length() && j < nums2.length() {
        if nums1⁅i⁆ == nums2⁅j⁆ {
            return nums1⁅i⁆
        }
        if nums1⁅i⁆ < nums2⁅j⁆ {
            i = i + 1
        } else {
            j = j + 1
        }
    }
    return -1
}

class Solution {
    micro getCommon(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): i64 {
        return getCommon(nums1, nums2)
    }
}
