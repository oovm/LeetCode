namespace leetcode.minimum_moves_to_equal_array_elements;

using std.collection;

# 每步把 n - 1 个元素加一，等价于把所有元素抬到最小值，总步数为 sum - min * n。
[export(case: "camelCase")]
micro minMoves(nums: ArrayList<i64>) -> i64 {
    let mut minimum: i64 = nums⁅0⁆
    let mut total: i64 = 0
    let mut position: usize = 0
    while position < nums.length() {
        let value: i64 = nums⁅position⁆
        total = total + value
        if value < minimum {
            minimum = value
        }
        position = position + 1
    }
    return total - minimum * (nums.length() as i64)
}

class Solution {
    micro minMoves(self, nums: ArrayList<i64>): i64 {
        return minMoves(nums)
    }
}
