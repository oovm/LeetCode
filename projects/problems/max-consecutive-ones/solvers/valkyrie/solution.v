namespace leetcode.max_consecutive_ones;

[export(case: "camelCase")]
micro find_max_consecutive_ones(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = 0
    let mut cur: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        let v: i64 = nums⁅i⁆
        if v == 1 {
            cur = cur + 1
            if cur > best {
                best = cur
            }
        } else {
            cur = 0
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro findMaxConsecutiveOnes(self, nums: ArrayList<i64>): i64 {
        return find_max_consecutive_ones(nums)
    }
}
