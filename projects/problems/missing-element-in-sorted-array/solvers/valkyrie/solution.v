namespace leetcode.missing_element_in_sorted_array;

using std.collection;

micro absent_before(nums: ArrayList<i64>, index: usize) -> i64 {
    return nums⁅index⁆ - nums⁅0⁆ - index as i64
}

# 缺失计数单调不减，二分定位第 k 个缺失值所在区间。
[export(case: "camelCase")]
micro missing_element(nums: ArrayList<i64>, k: i64) -> i64 {
    let count: usize = nums.length()
    let total: i64 = absent_before(nums, count - 1)
    if k > total {
        return nums⁅count - 1⁆ + k - total
    }
    let mut low: usize = 0
    let mut high: usize = count - 1
    while low < high {
        let middle: usize = (low + high) / 2
        if absent_before(nums, middle) >= k {
            high = middle
        } else {
            low = middle + 1
        }
    }
    return nums⁅low - 1⁆ + k - absent_before(nums, low - 1)
}

class Solution {
    micro missingElement(self, nums: ArrayList<i64>, k: i64): i64 {
        return missing_element(nums, k)
    }
}
