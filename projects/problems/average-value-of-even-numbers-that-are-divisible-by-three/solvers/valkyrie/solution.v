namespace leetcode.average_value_of_even_numbers_that_are_divisible_by_three

# 能被 3 整除的偶数即 6 的倍数；取这些数的和与个数，整除求平均，无则返回 0。
[export(case: "camelCase")]
micro averageValue(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut picked: i64 = 0
    let mut i: usize = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        if value % 6 == 0 {
            total = total + value
            picked = picked + 1
        }
        i = i + 1
    }
    if picked == 0 {
        return 0
    }
    return total / picked
}

class Solution {
    micro averageValue(self, nums: ArrayList<i64>): i64 {
        return averageValue(nums)
    }
}
