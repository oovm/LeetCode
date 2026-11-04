namespace leetcode.difference_between_element_sum_and_digit_sum_of_an_array

# 分别求元素和与十进制数位和，返回二者绝对差。
[export(case: "camelCase")]
micro differenceOfSum(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut elementSum: i64 = 0
    let mut digitSum: i64 = 0
    let mut i: usize = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        elementSum = elementSum + value
        let mut rest: i64 = value
        while rest > 0 {
            digitSum = digitSum + rest % 10
            rest = rest / 10
        }
        i = i + 1
    }
    let mut difference: i64 = elementSum - digitSum
    if difference < 0 {
        difference = 0 - difference
    }
    return difference
}

class Solution {
    micro differenceOfSum(self, nums: ArrayList<i64>): i64 {
        return differenceOfSum(nums)
    }
}
