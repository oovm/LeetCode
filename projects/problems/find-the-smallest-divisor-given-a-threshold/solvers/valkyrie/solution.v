namespace leetcode.find_the_smallest_divisor_given_a_threshold;

using std.collection;

# 二分答案：除数越大，商之和越小。
# 给定除数 `d` 时，和为每个元素向上取整后的商之和。
micro total(nums: ArrayList<i64>, divisor: i64) -> i64 {
    let mut sum: i64 = 0
    let mut loop_index_9: usize = 0
    while loop_index_9 < nums.length() {
        let value: i64 = nums⁅loop_index_9⁆
            sum = sum + (value + divisor - 1) / divisor
        loop_index_9 = loop_index_9 + 1
    }
    return sum
}

[export(case: "camelCase")]
micro smallestDivisor(nums: ArrayList<i64>, threshold: i64) -> i64 {
    let mut low: i64 = 1
    let mut high: i64 = 0
    let mut loop_index_19: usize = 0
    while loop_index_19 < nums.length() {
        let value: i64 = nums⁅loop_index_19⁆
            if value > high {
                high = value
            }
        loop_index_19 = loop_index_19 + 1
    }
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if total(nums, mid) <= threshold {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro smallestDivisor(self, nums: ArrayList<i64>, threshold: i64): i64 {
        return smallestDivisor(nums, threshold)
    }
}
