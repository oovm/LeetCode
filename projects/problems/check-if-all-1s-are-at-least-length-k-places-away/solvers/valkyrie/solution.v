namespace leetcode.check_if_all_1s_are_at_least_length_k_places_away

# 记录上一个 1 的位置，相邻两个 1 之间的 0 个数必须不少于 k。
[export(case: "camelCase")]
micro kLengthApart(nums: [i64], k: i64) -> bool {
    let count: usize = nums.length()
    let mut previous: i64 = 0 - k - 1
    let mut i: usize = 0
    while i < count {
        if nums⁅i⁆ == 1 {
            let gaps: i64 = i as i64 - previous - 1
            if gaps < k {
                return false
            }
            previous = i as i64
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro kLengthApart(self, nums: [i64], k: i64): bool {
        return kLengthApart(nums, k)
    }
}
