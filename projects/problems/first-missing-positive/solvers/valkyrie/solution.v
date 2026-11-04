namespace leetcode.first_missing_positive;

# 原地置换：把 1..n 的值换到自己的位置，额外空间为常数，全部写入落在定长载体上。
[export(case: "camelCase")]
micro first_missing_positive(mut nums: [i64]) -> i64 {
    let count: usize = nums.length()
    let mut i: usize = 0
    while i < count {
        let value: i64 = nums⁅i⁆
        if value >= 1 && value <= count as i64 {
            let target: usize = (value - 1) as usize
            if nums⁅target⁆ != value {
                let held: i64 = nums⁅target⁆
                nums⁅target⁆ = value
                nums⁅i⁆ = held
            } else {
                i = i + 1
            }
        } else {
            i = i + 1
        }
    }

    let mut cursor: usize = 0
    while cursor < count {
        if nums⁅cursor⁆ != (cursor + 1) as i64 {
            return (cursor + 1) as i64
        }
        cursor = cursor + 1
    }
    return (count + 1) as i64
}

class Solution {
    micro firstMissingPositive(mut self, nums: [i64]): i64 {
        return first_missing_positive(nums)
    }
}
