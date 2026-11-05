namespace leetcode.kth_smallest_subarray_sum;

using std.collection;

# 二分答案：check(s) 用双指针在 O(n) 内统计和不超过 s 的非空子数组个数。
[export(case: "camelCase")]
micro kth_smallest_subarray_sum(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut low: i64 = nums⁅0⁆
    let mut high: i64 = 0
    loop index in 0..nums.length() {
        let value: i64 = nums⁅index⁆
        high = high + value
        if value < low {
            low = value
        }
    }

    let count: i64 = nums.length() as i64
    while low < high {
        let middle: i64 = low + (high - low) / 2

        let mut total: i64 = 0
        let mut running: i64 = 0
        let mut left: i64 = 0
        let mut right: i64 = 0
        let mut enough: bool = false
        while right < count {
            running = running + nums⁅right as usize⁆
            while running > middle {
                running = running - nums⁅left as usize⁆
                left = left + 1
            }
            total = total + (right - left + 1)
            if total >= k {
                enough = true
            }
            right = right + 1
        }

        if enough {
            high = middle
        } else {
            low = middle + 1
        }
    }
    return low
}

class Solution {
    micro kthSmallestSubarraySum(self, nums: ArrayList<i64>, k: i64): i64 {
        return kth_smallest_subarray_sum(nums, k)
    }
}
