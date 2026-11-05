namespace leetcode.maximum_length_of_repeated_subarray;

using std.collection;

# 经典公共子数组 DP，滚动两行，空间 O(m)，时间 O(n*m)。
[export(case: "camelCase")]
micro find_length(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> i64 {
    let width: usize = nums2.length()
    if width == 0 || nums1.length() == 0 {
        return 0
    }
    let mut previous: ArrayList<i64> = ArrayList::new(width + 1)
    let mut current: ArrayList<i64> = ArrayList::new(width + 1)
    let mut slot: usize = 0
    while slot <= width {
        previous.push(0)
        current.push(0)
        slot = slot + 1
    }
    let mut best: i64 = 0
    let mut row: usize = 0
    while row < nums1.length() {
        let value: i64 = nums1⁅row⁆
        let mut column: usize = 0
        while column < width {
            if value == nums2⁅column⁆ {
                let length: i64 = previous⁅column⁆ + 1
                current⁅column + 1⁆ = length
                if length > best {
                    best = length
                }
            } else {
                current⁅column + 1⁆ = 0
            }
            column = column + 1
        }
        let swap: ArrayList<i64> = previous
        previous = current
        current = swap
        row = row + 1
    }
    return best
}

class Solution {
    micro findLength(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): i64 {
        return find_length(nums1, nums2)
    }
}
