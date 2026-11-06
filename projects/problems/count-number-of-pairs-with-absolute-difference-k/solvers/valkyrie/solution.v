namespace leetcode.count_number_of_pairs_with_absolute_difference_k;

using std.collection;

# 枚举 i < j，统计绝对差恰为 k 的数对。
[export(case: "camelCase")]
micro countKDifference(nums: ArrayList<i64>, k: i64) -> i64 {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut left: usize = 0
    while left < count {
        let mut right: usize = left + 1
        while right < count {
            let mut gap: i64 = nums⁅left⁆ - nums⁅right⁆
            if gap < 0 {
                gap = -gap
            }
            if gap == k {
                total = total + 1
            }
            right = right + 1
        }
        left = left + 1
    }
    return total
}

class Solution {
    micro countKDifference(self, nums: ArrayList<i64>, k: i64): i64 {
        return countKDifference(nums, k)
    }
}
