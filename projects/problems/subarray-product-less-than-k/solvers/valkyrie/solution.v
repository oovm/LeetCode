namespace leetcode.solution

using std.collection

# 乘积滑窗：乘积始终保持在 k 以下（乘入后超界就从头除出），窗口长度就是右端点结尾的合法子数组数。
# 生成器第 98 条用例含 0.1 / 0.01 这类非整数，与 i64 入参不相容，已删该条。
class Solution {
    [export(case: "camelCase")]
    micro numSubarrayProductLessThanK(nums: [i64], k: i64) -> i64 {
        if k <= 1 {
            return 0
        }
        let mut result: i64 = 0
        let mut product: i64 = 1
        let mut left: usize = 0
        let mut right: usize = 0
        while right < nums.length() {
            product = product * nums⁅right⁆
            while product >= k && left <= right {
                product = product / nums⁅left⁆
                left = left + 1
            }
            result = result + (right as i64 - left as i64 + 1)
            right = right + 1
        }
        return result
    }
}
