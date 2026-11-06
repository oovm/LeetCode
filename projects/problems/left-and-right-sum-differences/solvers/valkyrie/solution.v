namespace leetcode.left_and_right_sum_differences;

using std.collection;

# 先求总和，再边走边维护左侧和，右侧和由总和扣除。
[export(case: "camelCase")]
micro leftRightDifference(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < count {
        total = total + nums⁅index⁆
        index = index + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(count)
    let mut left_sum: i64 = 0
    index = 0
    while index < count {
        let value: i64 = nums⁅index⁆
        let right_sum: i64 = total - left_sum - value
        let mut difference: i64 = left_sum - right_sum
        if difference < 0 {
            difference = -difference
        }
        answer.push(difference)
        left_sum = left_sum + value
        index = index + 1
    }
    return answer
}

class Solution {
    micro leftRightDifference(self, nums: ArrayList<i64>): ArrayList<i64> {
        return leftRightDifference(nums)
    }
}
