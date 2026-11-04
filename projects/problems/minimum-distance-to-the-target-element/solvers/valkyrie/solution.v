namespace leetcode.minimum_distance_to_the_target_element

# 扫描所有等于 target 的位置，取与 start 的绝对差最小值。
[export(case: "camelCase")]
micro getMinDistance(nums: ArrayList<i64>, target: i64, start: i64) -> i64 {
    let count: usize = nums.length()
    let mut best: i64 = 1000000000
    let mut i: usize = 0
    while i < count {
        if nums⁅i⁆ == target {
            let mut distance: i64 = i as i64 - start
            if distance < 0 {
                distance = 0 - distance
            }
            if distance < best {
                best = distance
            }
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro getMinDistance(self, nums: ArrayList<i64>, target: i64, start: i64): i64 {
        return getMinDistance(nums, target, start)
    }
}
