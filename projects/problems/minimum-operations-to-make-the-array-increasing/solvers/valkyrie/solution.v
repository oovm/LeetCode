namespace leetcode.minimum_operations_to_make_the_array_increasing

# 严格递增要求相邻差至少 1，逐位把当前值抬到前值 + 1，累计抬升量即操作数。
[export(case: "camelCase")]
micro minOperations(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let zero: usize = 0
    let mut previous: i64 = nums⁅zero⁆
    let mut total: i64 = 0
    let mut i: usize = 1
    while i < count {
        let value: i64 = nums⁅i⁆
        if value <= previous {
            let raised: i64 = previous + 1
            total = total + raised - value
            previous = raised
        }
        if value > previous {
            previous = value
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro minOperations(self, nums: ArrayList<i64>): i64 {
        return minOperations(nums)
    }
}
