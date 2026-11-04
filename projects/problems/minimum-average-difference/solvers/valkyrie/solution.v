namespace leetcode.minimum_average_difference;

using std.collection;

# 前缀和：逐位置计算左侧平均值与右侧平均值，取绝对差最小者。
# 右端为空时右侧平均值定义为 0。
[export(case: "camelCase")]
micro minimumAverageDifference(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut loop_index_10: usize = 0
    while loop_index_10 < nums.length() {
        let value: i64 = nums⁅loop_index_10⁆
            total = total + value
        loop_index_10 = loop_index_10 + 1
    }

    let length: i64 = nums.length() as i64
    let mut prefix: i64 = 0
    let mut best: i64 = -1
    let mut best_index: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        prefix = prefix + nums⁅index⁆
        let left_average: i64 = prefix / (index as i64 + 1)
        let mut right_average: i64 = 0
        if index + 1 < nums.length() {
            right_average = (total - prefix) / (length - index as i64 - 1)
        }
        let mut difference: i64 = left_average - right_average
        if difference < 0 {
            difference = -difference
        }
        if best < 0 || difference < best {
            best = difference
            best_index = index as i64
        }
        index = index + 1
    }
    return best_index
}

class Solution {
    micro minimumAverageDifference(self, nums: ArrayList<i64>): i64 {
        return minimumAverageDifference(nums)
    }
}
