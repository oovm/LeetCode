namespace leetcode.three_sum_smaller;

using std.collection;

# 排序后固定最小元，双指针：和小于 target 时 [lo, hi) 全部可配对，一次计入。
[export(case: "camelCase")]
micro threeSumSmaller(nums: ArrayList<i64>, target: i64) -> i64 {
    let mut sorted: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        sorted.push(value)
    }
    sort(sorted)
    let length: usize = sorted.length()
    let mut count: i64 = 0
    let mut first: usize = 0
    while first + 2 < length {
        let mut low: usize = first + 1
        let mut high: usize = length - 1
        while low < high {
            let sum: i64 = sorted⁅first⁆ + sorted⁅low⁆ + sorted⁅high⁆
            if sum < target {
                count = count + (high - low) as i64
                low = low + 1
            } else {
                high = high - 1
            }
        }
        first = first + 1
    }
    return count
}

class Solution {
    micro threeSumSmaller(self, nums: ArrayList<i64>, target: i64): i64 {
        return threeSumSmaller(nums, target)
    }
}
