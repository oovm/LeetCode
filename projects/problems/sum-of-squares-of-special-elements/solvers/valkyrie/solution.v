namespace leetcode.sum_of_squares_of_special_elements;

using std.collection;

# 对下标 i（1 基）能整除 n 的元素求平方和。
[export(case: "camelCase")]
micro sumOfSquares(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < count {
        if count % (index + 1) == 0 {
            let value: i64 = nums⁅index⁆
            total = total + value * value
        }
        index = index + 1
    }
    return total
}

class Solution {
    micro sumOfSquares(self, nums: ArrayList<i64>): i64 {
        return sumOfSquares(nums)
    }
}
