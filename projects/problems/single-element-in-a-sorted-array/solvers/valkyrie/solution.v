namespace leetcode.single_element_in_a_sorted_array;

using std.collection;

# 二分且 mid 恒取偶：配对 `(2k, 2k+1)` 相等则答案在右半（mid+2），否则在左半（含 mid）。O(log n)。
[export(case: "camelCase")]
micro singleNonDuplicate(nums: ArrayList<i64>) -> i64 {
    let mut lo: usize = 0
    let mut hi: usize = nums.length() - 1
    while lo < hi {
        let mut mid: usize = lo + (hi - lo) / 2
        if mid % 2 == 1 {
            mid = mid - 1
        }
        if nums⁅mid⁆ == nums⁅mid + 1⁆ {
            lo = mid + 2
        } else {
            hi = mid
        }
    }
    return nums⁅lo⁆
}

class Solution {
    micro singleNonDuplicate(self, nums: ArrayList<i64>): i64 {
        return singleNonDuplicate(nums)
    }
}
