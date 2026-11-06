namespace leetcode.max_pair_sum_in_an_array;

using std.collection;

# 按最大数位分组，组内取最大两数之和，再取各组最大值。
[export(case: "camelCase")]
micro maxSum(nums: ArrayList<i64>) -> i64 {
    let mut best: i64 = -1
    let mut best_by_digit: ArrayList<i64> = ArrayList::new(10)
    let mut digit_index: usize = 0
    while digit_index < 10 {
        best_by_digit.push(-1)
        digit_index = digit_index + 1
    }
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        let mut digit: i64 = 0
        let mut rest: i64 = value
        while rest > 0 {
            let current: i64 = rest % 10
            if current > digit {
                digit = current
            }
            rest = rest / 10
        }
        let slot: usize = digit as usize
        if best_by_digit⁅slot⁆ >= 0 {
            let pair: i64 = best_by_digit⁅slot⁆ + value
            if pair > best {
                best = pair
            }
        }
        if value > best_by_digit⁅slot⁆ {
            best_by_digit⁅slot⁆ = value
        }
        index = index + 1
    }
    return best
}

class Solution {
    micro maxSum(self, nums: ArrayList<i64>): i64 {
        return maxSum(nums)
    }
}
