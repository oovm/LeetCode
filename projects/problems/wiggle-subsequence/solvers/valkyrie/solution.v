namespace leetcode.wiggle_subsequence;

using std.collection;
using std.math;

# 贪心 up/down 两态：上升时 up = down + 1，下降时 down = up + 1；相等跳过。O(n)。
[export(case: "camelCase")]
micro wiggleMaxLength(nums: ArrayList<i64>) -> i64 {
    let n: usize = nums.length()
    if n == 0 {
        return 0
    }
    let mut up: i64 = 1
    let mut down: i64 = 1
    let mut i: usize = 1
    while i < n {
        if nums⁅i⁆ > nums⁅i - 1⁆ {
            up = down + 1
        } else if nums⁅i⁆ < nums⁅i - 1⁆ {
            down = up + 1
        }
        i = i + 1
    }
    return max(up, down)
}

class Solution {
    micro wiggleMaxLength(self, nums: ArrayList<i64>): i64 {
        return wiggleMaxLength(nums)
    }
}
