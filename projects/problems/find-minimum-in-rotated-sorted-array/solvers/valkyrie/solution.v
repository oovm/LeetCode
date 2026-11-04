namespace leetcode.find_minimum_in_rotated_sorted_array;

# 旋转有序数组求最小：与右端比较即可判定最小值落在哪半，O(log n)。
# 定长载体读侧：下标在窗口内单调收缩，全程只读不切片。
[export(case: "camelCase")]
micro find_min(nums: [i64]) -> i64 {
    let mut low: i64 = 0
    let mut high: i64 = nums.length() as i64 - 1
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if nums⁅mid as usize⁆ > nums⁅high as usize⁆ {
            # 中点比右端大 ⇒ 断点（最小值）在右半段。
            low = mid + 1
        } else {
            high = mid
        }
    }
    return nums⁅low as usize⁆
}

class Solution {
    micro findMin(self, nums: [i64]): i64 {
        return find_min(nums)
    }
}
