namespace leetcode.count_partitions_with_even_sum_difference;

using std.collection;

# 前缀和推进，逐刀检查左和减右和是否为偶数。
[export(case: "camelCase")]
micro countPartitions(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < nums.length() {
        total = total + nums⁅index⁆
        index = index + 1
    }
    let mut answer: i64 = 0
    let mut left_sum: i64 = 0
    index = 0
    while index + 1 < nums.length() {
        left_sum = left_sum + nums⁅index⁆
        let right_sum: i64 = total - left_sum
        let difference: i64 = left_sum - right_sum
        if difference % 2 == 0 {
            answer = answer + 1
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro countPartitions(self, nums: ArrayList<i64>): i64 {
        return countPartitions(nums)
    }
}
