namespace leetcode.shortest_subarray_with_or_at_least_k_i;

using std.collection;

# 滑动窗口：按位计数维护窗口 OR，收缩左端直到 OR 小于 k。
[export(case: "camelCase")]
micro minimumSubarrayLength(nums: ArrayList<i64>, k: i64) -> i64 {
    let n: usize = nums.length()
    let mut counts: ArrayList<i64> = ArrayList::new(32)
    let mut i: usize = 0
    while i < 32 {
        counts.push(0)
        i = i + 1
    }
    let mut answer: i64 = n as i64 + 1
    let mut current: i64 = 0
    let mut left: usize = 0
    let mut right: usize = 0
    while right < n {
        let value: i64 = nums⁅right⁆
        current = current.bit_or(value)
        let mut shift: i64 = 0
        while shift < 32 {
            # `1 << shift` 的移位量按位宽同型，统一用 i64 掩码避免跨类型候选歧义。
            let mask: i64 = (1 as i64).bit_shift_left(shift)
            if value.bit_and(mask) != 0 {
                counts⁅shift as usize⁆ = counts⁅shift as usize⁆ + 1
            }
            shift = shift + 1
        }
        while current >= k && left <= right {
            let length: i64 = (right - left + 1) as i64
            if length < answer {
                answer = length
            }
            let leaving: i64 = nums⁅left⁆
            let mut shift: i64 = 0
            while shift < 32 {
                let mask: i64 = (1 as i64).bit_shift_left(shift)
                if leaving.bit_and(mask) != 0 {
                    counts⁅shift as usize⁆ = counts⁅shift as usize⁆ - 1
                    if counts⁅shift as usize⁆ == 0 {
                        current = current.bit_xor(mask)
                    }
                }
                shift = shift + 1
            }
            left = left + 1
        }
        right = right + 1
    }
    if answer > n as i64 {
        return -1
    }
    return answer
}

class Solution {
    micro minimumSubarrayLength(self, nums: ArrayList<i64>, k: i64): i64 {
        return minimumSubarrayLength(nums, k)
    }
}
