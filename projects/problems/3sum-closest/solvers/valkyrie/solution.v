namespace leetcode.three_sum_closest;

using std.collection;
using std.math;

# 排序后固定最小元，双指针收拢三数和，追踪与 target 距离最小者。
[export(case: "camelCase")]
micro threeSumClosest(nums: ArrayList<i64>, target: i64) -> i64 {
    let mut sorted: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        sorted.push(value)
    }
    sort(sorted)
    let length: usize = sorted.length()
    let mut best: i64 = sorted⁅0⁆ + sorted⁅1⁆ + sorted⁅2⁆
    let mut first: usize = 0
    while first + 2 < length {
        let mut low: usize = first + 1
        let mut high: usize = length - 1
        while low < high {
            let sum: i64 = sorted⁅first⁆ + sorted⁅low⁆ + sorted⁅high⁆
            if abs(sum - target) < abs(best - target) {
                best = sum
            }
            if sum < target {
                low = low + 1
            } else if sum > target {
                high = high - 1
            } else {
                return sum
            }
        }
        first = first + 1
    }
    return best
}

class Solution {
    micro threeSumClosest(self, nums: ArrayList<i64>, target: i64): i64 {
        return threeSumClosest(nums, target)
    }
}
