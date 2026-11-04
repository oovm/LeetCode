namespace leetcode.maximum_product_of_two_elements_in_an_array

# 最大 (a - 1) * (b - 1) 来自最大的两个元素，单次扫描维护前两名。
[export(case: "camelCase")]
micro maxProduct(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut first: i64 = 0
    let mut second: i64 = 0
    let mut i: usize = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        let mut placed: bool = false
        if value > first {
            second = first
            first = value
            placed = true
        }
        if placed == false {
            if value > second {
                second = value
            }
        }
        i = i + 1
    }
    return (first - 1) * (second - 1)
}

class Solution {
    micro maxProduct(self, nums: ArrayList<i64>): i64 {
        return maxProduct(nums)
    }
}
