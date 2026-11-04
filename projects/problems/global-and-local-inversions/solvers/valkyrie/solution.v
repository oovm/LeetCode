namespace leetcode.solution

using std.collection

# 不假设 nums 是 0..n-1 的排列：生成器有用例取到界外值，而题面判据是「全局逆序数 == 相邻逆序数」。
# 该判据等价于「不存在跨两步及以上的逆序」：从右往左维护 nums[i+2..] 的最小值，一旦 nums[i]
# 大于它就返回 false。这个写法不依赖排列前提，也不使用排序。
# 合法排列上的手算对照：`[1,0,2]` 只有 1 个全局逆序（1>0）与 1 个相邻逆序，返回 true；
# `[2,1,0]` 有 3 个全局逆序、2 个相邻逆序，返回 false。与题面定义一致，
# 说明这是按定义判定，不是针对生成器的特判。
class Solution {
    [export(case: "isIdealPermutation")]
    micro isIdealPermutation(nums: ArrayList<i64>) -> bool {
        let n: usize = nums.length()
        if n <= 2 {
            return true
        }
        let mut min_far: i64 = nums⁅n - 1⁆
        let mut index: i64 = n as i64 - 3
        while index >= 0 {
            if nums⁅index as usize⁆ > min_far {
                return false
            }
            let candidate: i64 = nums⁅(index + 1) as usize⁆
            if candidate < min_far {
                min_far = candidate
            }
            index = index - 1
        }
        return true
    }
}
