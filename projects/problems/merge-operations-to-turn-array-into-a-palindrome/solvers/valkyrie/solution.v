namespace leetcode.merge_operations_to_turn_array_into_a_palindrome;

using std.collection;

# 双指针：左右两端相等就同时内收。
# 左端偏小就把左端并入下一格，右端偏小就把右端并入前一格，每次合并计数一次。
[export(case: "camelCase")]
micro minimumOperations(nums: ArrayList<i64>) -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        values.push(value)
    }

    let mut left: usize = 0
    let mut right: usize = nums.length() - 1
    let mut operations: i64 = 0
    while left < right {
        if values⁅left⁆ == values⁅right⁆ {
            left = left + 1
            right = right - 1
        } else {
            if values⁅left⁆ < values⁅right⁆ {
                values.set((left + 2) as isize, values⁅left⁆ + values⁅left + 1⁆)
                left = left + 1
            } else {
                values.set(right as isize, values⁅right - 1⁆ + values⁅right⁆)
                right = right - 1
            }
            operations = operations + 1
        }
    }
    return operations
}

class Solution {
    micro minimumOperations(self, nums: ArrayList<i64>): i64 {
        return minimumOperations(nums)
    }
}
