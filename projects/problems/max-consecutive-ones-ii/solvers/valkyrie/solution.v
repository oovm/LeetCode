namespace leetcode.max_consecutive_ones_ii;

using std.collection;

# 至多含一个 0 的窗口：左端在第二个 0 出现时跳到其前一位置；窗口长度即答案。
[export(case: "camelCase")]
micro findMaxConsecutiveOnes(nums: ArrayList<i64>) -> i64 {
    let mut left: usize = 0
    let mut last_zero: i64 = -1
    let mut best: i64 = 0
    let mut right: usize = 0
    while right < nums.length() {
        if nums⁅right⁆ == 0 {
            if last_zero >= 0 {
                left = last_zero as usize + 1
            }
            last_zero = right as i64
        }
        let length: i64 = right as i64 - left as i64 + 1
        if length > best {
            best = length
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro findMaxConsecutiveOnes(self, nums: ArrayList<i64>): i64 {
        return findMaxConsecutiveOnes(nums)
    }
}
