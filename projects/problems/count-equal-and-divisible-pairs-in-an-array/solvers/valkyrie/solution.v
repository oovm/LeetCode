namespace leetcode.count_equal_and_divisible_pairs_in_an_array;

using std.collection;

# 枚举 i < j，同时要求等值且下标乘积能被 k 整除。
[export(case: "camelCase")]
micro countPairs(nums: ArrayList<i64>, k: i64) -> i64 {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut left: usize = 0
    while left < count {
        let mut right: usize = left + 1
        while right < count {
            if nums⁅left⁆ == nums⁅right⁆ {
                let product: i64 = (left as i64) * (right as i64)
                if product % k == 0 {
                    total = total + 1
                }
            }
            right = right + 1
        }
        left = left + 1
    }
    return total
}

class Solution {
    micro countPairs(self, nums: ArrayList<i64>, k: i64): i64 {
        return countPairs(nums, k)
    }
}
