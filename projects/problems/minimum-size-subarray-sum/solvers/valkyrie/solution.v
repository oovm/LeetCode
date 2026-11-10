namespace leetcode.minimum_size_subarray_sum;

using std.collection;

# 滑动窗口：右端扩张累加，和达标后左端收缩取最短；正数数组保证单调，O(n)。
[export(case: "camelCase")]
micro minSubArrayLen(target: i64, nums: ArrayList<i64>) -> i64 {
    let mut sum: i64 = 0
    let mut left: usize = 0
    let mut best: i64 = -1
    let mut right: usize = 0
    while right < nums.length() {
        sum = sum + nums⁅right⁆
        while sum >= target {
            let length: i64 = right as i64 - left as i64 + 1
            if best == -1 || length < best {
                best = length
            }
            sum = sum - nums⁅left⁆
            left = left + 1
        }
        right = right + 1
    }
    if best == -1 {
        return 0
    }
    return best
}

class Solution {
    micro minSubArrayLen(self, target: i64, nums: ArrayList<i64>): i64 {
        return minSubArrayLen(target, nums)
    }
}
