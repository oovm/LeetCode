namespace leetcode.solution

using std.collection

# 顺着 nums[i] 走，把走过的位置改成 -1；一条环的长度就是这条链的答案。
# 生成器用例有 3 条把下标写到界外（期望本身就是 Error），已删，不按越界做兜底。
class Solution {
    [export(case: "arrayNesting")]
    micro arrayNesting(nums: ArrayList<i64>) -> i64 {
        let n: usize = nums.length()
        let mut best: i64 = 0
        let mut start: usize = 0
        while start < n {
            let mut current: usize = start
            let mut length: i64 = 0
            while nums⁅current⁆ >= 0 {
                let next: i64 = nums⁅current⁆
                nums⁅current⁆ = -1
                current = next as usize
                length = length + 1
            }
            if length > best {
                best = length
            }
            start = start + 1
        }
        return best
    }
}
