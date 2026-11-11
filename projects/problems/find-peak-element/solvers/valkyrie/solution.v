namespace leetcode.find_peak_element;

using std.collection;

# 二分：`nums[mid] < nums[mid+1]` 则右半必有峰，否则左半（含 mid）有峰。
[export(case: "camelCase")]
micro findPeakElement(nums: [i64]) -> i64 {
    let mut lo: usize = 0
    let mut hi: usize = nums.length() - 1
    while lo < hi {
        let mid: usize = (lo + hi) / 2
        if nums⁅mid⁆ < nums⁅mid + 1⁆ {
            lo = mid + 1
        } else {
            hi = mid
        }
    }
    return lo as i64
}

class Solution {
    micro findPeakElement(self, nums: [i64]): i64 {
        return findPeakElement(nums)
    }
}
