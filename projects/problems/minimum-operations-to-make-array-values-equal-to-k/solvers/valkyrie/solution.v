namespace leetcode.minimum_operations_to_make_array_values_equal_to_k;

using std.collection;

# 存在小于 k 的值则无解；否则答案是不重复值个数，最小值恰为 k 时少一次。
[export(case: "camelCase")]
micro minOperations(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut distinct: ArrayList<i64> = ArrayList::new(nums.length())
    let mut distinct_count: i64 = 0
    let mut minimum: i64 = -1
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if value < k {
            return -1
        }
        if minimum == -1 || value < minimum {
            minimum = value
        }
        if !distinct.contains(value) {
            distinct.push(value)
            distinct_count = distinct_count + 1
        }
        index = index + 1
    }
    let mut answer: i64 = distinct_count
    if minimum == k {
        answer = answer - 1
    }
    return answer
}

class Solution {
    micro minOperations(self, nums: ArrayList<i64>, k: i64): i64 {
        return minOperations(nums, k)
    }
}
