namespace leetcode.maximum_sum_circular_subarray;

using std.collection;

# 环状最大子数组：要么是不跨界的最大子段，要么是总和减去不跨界的最小子段。
# 全为负数时只能取最大元素，故 `best` 为负时直接返回 `best`。
[export(case: "camelCase")]
micro maxSubarraySumCircular(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut best: i64 = nums⁅0⁆
    let mut worst: i64 = nums⁅0⁆
    let mut max_ending: i64 = 0
    let mut min_ending: i64 = 0

    let mut index: usize = 0
    while index < count {
        let value: i64 = nums⁅index⁆
        total = total + value

        if max_ending + value > value {
            max_ending = max_ending + value
        } else {
            max_ending = value
        }
        if max_ending > best {
            best = max_ending
        }

        if min_ending + value < value {
            min_ending = min_ending + value
        } else {
            min_ending = value
        }
        if min_ending < worst {
            worst = min_ending
        }

        index = index + 1
    }

    if best < 0 {
        return best
    }
    let wrapped: i64 = total - worst
    if wrapped > best {
        return wrapped
    }
    return best
}

class Solution {
    micro maxSubarraySumCircular(self, nums: ArrayList<i64>): i64 {
        return maxSubarraySumCircular(nums)
    }
}
