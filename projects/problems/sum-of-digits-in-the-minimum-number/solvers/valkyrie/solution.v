namespace leetcode.sum_of_digits_in_the_minimum_number

# 取最小值，十进制逐位求和；和为偶数返回 1，否则 0。
[export(case: "camelCase")]
micro sumOfDigits(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let zero: usize = 0
    let mut low: i64 = nums⁅zero⁆
    let mut i: usize = 1
    while i < count {
        let value: i64 = nums⁅i⁆
        if value < low {
            low = value
        }
        i = i + 1
    }
    let mut rest: i64 = low
    let mut sum: i64 = 0
    while rest > 0 {
        sum = sum + rest % 10
        rest = rest / 10
    }
    if sum % 2 == 0 {
        return 1
    }
    return 0
}

class Solution {
    micro sumOfDigits(self, nums: ArrayList<i64>): i64 {
        return sumOfDigits(nums)
    }
}
