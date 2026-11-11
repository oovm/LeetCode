namespace leetcode.find_the_number_of_good_pairs_i;

using std.collection;

# 双重枚举，检查 nums1[i] 能否被 nums2[j] * k 整除。
[export(case: "camelCase")]
micro numberOfPairs(nums1: [i64], nums2: [i64], k: i64) -> i64 {
    let mut total: i64 = 0
    let mut left: usize = 0
    while left < nums1.length() {
        let mut right: usize = 0
        while right < nums2.length() {
            let divisor: i64 = nums2⁅right⁆ * k
            if nums1⁅left⁆ % divisor == 0 {
                total = total + 1
            }
            right = right + 1
        }
        left = left + 1
    }
    return total
}

class Solution {
    micro numberOfPairs(self, nums1: [i64], nums2: [i64], k: i64): i64 {
        return numberOfPairs(nums1, nums2, k)
    }
}
