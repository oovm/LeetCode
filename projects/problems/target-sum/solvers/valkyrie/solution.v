namespace leetcode.target_sum;

using std.collection;

# DFS 递归：每个数取 + 或 -，剩余和为 0 且用完即 +1；n <= 20 时 2^n 可接受。
micro ways(nums: ArrayList<i64>, i: usize, remain: i64) -> i64 {
    if i == nums.length() {
        if remain == 0 {
            return 1
        }
        return 0
    }
    return ways(nums, i + 1, remain - nums⁅i⁆) + ways(nums, i + 1, remain + nums⁅i⁆)
}

[export(case: "camelCase")]
micro findTargetSumWays(nums: ArrayList<i64>, target: i64) -> i64 {
    return ways(nums, 0, target)
}

class Solution {
    micro findTargetSumWays(self, nums: ArrayList<i64>, target: i64): i64 {
        return findTargetSumWays(nums, target)
    }
}
