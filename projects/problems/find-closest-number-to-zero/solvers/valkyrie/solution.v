namespace leetcode.find_closest_number_to_zero;

using std.collection;

# 找绝对值最小的数；绝对值相同取较大者。
[export(case: "camelCase")]
micro findClosestNumber(nums: [i64]) -> i64 {
    let mut best: i64 = nums⁅0⁆
    let mut index: usize = 1
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        let mut magnitude: i64 = value
        if magnitude < 0 {
            magnitude = -magnitude
        }
        let mut best_magnitude: i64 = best
        if best_magnitude < 0 {
            best_magnitude = -best_magnitude
        }
        if magnitude < best_magnitude || (magnitude == best_magnitude && value > best) {
            best = value
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro findClosestNumber(self, nums: [i64]): i64 {
        return findClosestNumber(nums)
    }
}
