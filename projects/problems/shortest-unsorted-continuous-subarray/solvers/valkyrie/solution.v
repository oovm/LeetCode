namespace leetcode.shortest_unsorted_continuous_subarray;

using std.collection;

# O(n)：先定位左端第一个破坏升序的位置与右端最后一个破坏升序的位置，
# 再以区间最小值 / 最大值向两侧扩张到正确边界。
[export(case: "camelCase")]
micro find_unsorted_subarray(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    if count <= 1 {
        return 0
    }
    let mut left: usize = 0
    while left + 1 < count && nums⁅left⁆ <= nums⁅left + 1⁆ {
        left = left + 1
    }
    if left + 1 >= count {
        return 0
    }
    let mut right: usize = count - 1
    while right > 0 && nums⁅right - 1⁆ <= nums⁅right⁆ {
        right = right - 1
    }

    let mut minimum: i64 = nums⁅left⁆
    let mut scan: usize = left
    while scan <= right {
        if nums⁅scan⁆ < minimum {
            minimum = nums⁅scan⁆
        }
        scan = scan + 1
    }
    let mut maximum: i64 = nums⁅right⁆
    scan = 0
    while scan <= right {
        if nums⁅scan⁆ > maximum {
            maximum = nums⁅scan⁆
        }
        scan = scan + 1
    }

    while left > 0 && nums⁅left - 1⁆ > minimum {
        left = left - 1
    }
    while right + 1 < count && nums⁅right + 1⁆ < maximum {
        right = right + 1
    }
    return (right - left + 1) as i64
}

class Solution {
    micro findUnsortedSubarray(self, nums: ArrayList<i64>): i64 {
        return find_unsorted_subarray(nums)
    }
}
