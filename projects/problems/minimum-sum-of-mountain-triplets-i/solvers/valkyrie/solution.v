namespace leetcode.minimum_sum_of_mountain_triplets_i;

using std.collection;

# 枚举峰顶，左右各取小于峰顶的最小值，取最小三数之和。
[export(case: "camelCase")]
micro minimumSum(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = -1
    let mut found: bool = false
    let mut middle: usize = 1
    while middle + 1 < nums.length() {
        let peak: i64 = nums⁅middle⁆
        let mut left_found: bool = false
        let mut left: i64 = 0
        let mut i: usize = 0
        while i < middle {
            let value: i64 = nums⁅i⁆
            if value < peak && (!left_found || value < left) {
                left = value
                left_found = true
            }
            i = i + 1
        }
        let mut right_found: bool = false
        let mut right: i64 = 0
        let mut k: usize = middle + 1
        while k < nums.length() {
            let value: i64 = nums⁅k⁆
            if value < peak && (!right_found || value < right) {
                right = value
                right_found = true
            }
            k = k + 1
        }
        if left_found && right_found {
            let sum: i64 = left + peak + right
            if !found || sum < best {
                best = sum
                found = true
            }
        }
        middle = middle + 1
    }
    return best
}

class Solution {
    micro minimumSum(self, nums: ArrayList<i64>): i64 {
        return minimumSum(nums)
    }
}
