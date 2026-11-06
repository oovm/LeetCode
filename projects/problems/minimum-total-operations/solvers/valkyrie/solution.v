namespace leetcode.minimum_total_operations;

using std.collection;

# 每对相邻不同元素贡献一次操作。
[export(case: "camelCase")]
micro minOperations(nums: ArrayList<i64>) -> i64 {
    let mut answer: i64 = 0
    let mut index: usize = 1
    while index < nums.length() {
        if nums⁅index - 1⁆ != nums⁅index⁆ {
            answer = answer + 1
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro minOperations(self, nums: ArrayList<i64>): i64 {
        return minOperations(nums)
    }
}
