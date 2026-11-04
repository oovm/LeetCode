namespace leetcode.solution

using std.collection

# 从右往左维护一个单调递减栈：被弹出来的值就是某个 `nums[j] > nums[k]` 里的 `nums[k]`，
# 记成「当前见过的最大的第三位」。之后只要左侧出现比它小的值，就凑成了 `nums[i] < nums[k] < nums[j]`。
class Solution {
    [export(case: "find132pattern")]
    micro find132pattern(nums: ArrayList<i64>) -> bool {
        let count: usize = nums.length()
        let mut stack: ArrayList<i64> = ArrayList::new(count)
        let mut has_third: bool = false
        let mut third: i64 = 0
        let mut index: i64 = count as i64 - 1
        while index >= 0 {
            let value: i64 = nums⁅index as usize⁆
            if has_third && value < third {
                return true
            }
            while stack.length() > 0 && stack⁅stack.length() - 1⁆ < value {
                third = stack.pop().unwrap()
                has_third = true
            }
            stack.push(value)
            index = index - 1
        }
        return false
    }
}
