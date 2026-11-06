namespace leetcode.shortest_subarray_with_or_at_least_k_i;

using std.collection;

# 滑动窗口：按位计数维护窗口 OR，收缩左端直到 OR 小于 k。
[export(case: "camelCase")]
micro minimumSubarrayLength(nums: ArrayList<i64>, k: i64) -> i64 {
    let n: usize = nums.length()
    let mut counts: ArrayList<i64> = ArrayList::new(32)
    let mut shift: usize = 0
    while shift < 32 {
        counts.push(0)
        shift = shift + 1
    }
    let mut answer: i64 = n as i64 + 1
    let mut current: i64 = 0
    let mut left: usize = 0
    let mut right: usize = 0
    while right < n {
        let value: i64 = nums⁅right⁆
        current = current.bit_or(value)
        shift = 0
        while shift < 32 {
            if value.bit_and(1 << shift) != 0 {
                counts⁅shift⁆ = counts⁅shift⁆ + 1
            }
            shift = shift + 1
        }
        while current >= k && left <= right {
            let length: i64 = (right - left + 1) as i64
            if length < answer {
                answer = length
            }
            let leaving: i64 = nums⁅left⁆
            shift = 0
            while shift < 32 {
                if leaving.bit_and(1 << shift) != 0 {
                    counts⁅shift⁆ = counts⁅shift⁆ - 1
                    if counts⁅shift⁆ == 0 {
                        current = current.bit_xor(1 << shift)
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
