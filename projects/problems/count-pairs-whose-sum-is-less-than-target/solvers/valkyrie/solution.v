namespace leetcode.count_pairs_whose_sum_is_less_than_target;

using std.collection;

# 数据规模很小，直接枚举所有 i < j 的和。
[export(case: "camelCase")]
micro countPairs(nums: [i64], target: i64) -> i64 {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut left: usize = 0
    while left < count {
        let mut right: usize = left + 1
        while right < count {
            if nums⁅left⁆ + nums⁅right⁆ < target {
                total = total + 1
            }
            right = right + 1
        }
        left = left + 1
    }
    return total
}

class Solution {
    micro countPairs(self, nums: [i64], target: i64): i64 {
        return countPairs(nums, target)
    }
}
