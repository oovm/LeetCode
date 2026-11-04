namespace leetcode.sum_of_absolute_differences_in_a_sorted_array;

using std.collection;

# 前缀和：对排序数组的第 `i` 项，
# 左侧差值和是 `nums[i] * i - prefix`，右侧差值和是 `right_sum - nums[i] * (n - i - 1)`。
[export(case: "camelCase")]
micro getSumAbsoluteDifferences(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut total: i64 = 0
    let mut loop_index_10: usize = 0
    while loop_index_10 < nums.length() {
        let value: i64 = nums⁅loop_index_10⁆
            total = total + value
        loop_index_10 = loop_index_10 + 1
    }

    let length: i64 = nums.length() as i64
    let mut result: ArrayList<i64> = ArrayList::new(nums.length())
    let mut prefix: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        let left: i64 = value * index as i64 - prefix
        let right: i64 = (total - prefix - value) - value * (length - index as i64 - 1)
        result.push(left + right)
        prefix = prefix + value
        index = index + 1
    }
    return result
}

class Solution {
    micro getSumAbsoluteDifferences(self, nums: ArrayList<i64>): ArrayList<i64> {
        return getSumAbsoluteDifferences(nums)
    }
}
