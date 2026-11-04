namespace leetcode.valid_triangle_number;

using std.collection;

# 排序后固定最长边，用双指针统计可行组合数。
# 两条短边之和大于最长边时，右指针左侧的所有位置都可行。
[export(case: "camelCase")]
micro triangleNumber(nums: ArrayList<i64>) -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        values.push(value)
    }
    sort(values)

    let mut total: i64 = 0
    let mut longest: usize = 2
    while longest < values.length() {
        let mut left: usize = 0
        let mut right: usize = longest - 1
        while left < right {
            if values⁅left⁆ + values⁅right⁆ > values⁅longest⁆ {
                total = total + (right - left) as i64
                right = right - 1
            } else {
                left = left + 1
            }
        }
        longest = longest + 1
    }
    return total
}

class Solution {
    micro triangleNumber(self, nums: ArrayList<i64>): i64 {
        return triangleNumber(nums)
    }
}
