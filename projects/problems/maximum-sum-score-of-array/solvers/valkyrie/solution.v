namespace leetcode.maximum_sum_score_of_array;

using std.collection;

# 前缀和 / 后缀和同步推进：left 为 nums[0..i]，right 为 nums[i..n-1]。
# 已还原（`172b944a` 修复块退出写回）：首次实现即用 `loop` 对形参累加，
# 旧 addon `07b625aa` 下该循环迭代正常但标量写回丢失（实测 0），当时临时改成
# `while` 下标累加。缺陷修复后按待还原组纪律恢复 `loop` 写法。
[export(case: "camelCase")]
micro maximumSumScore(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    loop value in nums {
        total = total + value
    }

    let mut left: i64 = 0
    let mut right: i64 = total
    let mut best: i64 = nums⁅0⁆
    let mut i: usize = 0
    while i < nums.length() {
        left = left + nums⁅i⁆
        if left > best {
            best = left
        }
        if right > best {
            best = right
        }
        right = right - nums⁅i⁆
        i = i + 1
    }
    return best
}

class Solution {
    micro maximumSumScore(self, nums: ArrayList<i64>): i64 {
        return maximumSumScore(nums)
    }
}
