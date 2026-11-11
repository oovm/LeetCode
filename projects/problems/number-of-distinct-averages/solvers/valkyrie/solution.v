namespace leetcode.solution

using std.collection

# 题面语义：排序后每次取「最小 + 最大」成对求平均，问不同平均值的种数。
# 生成器用例存在奇数长度，中间元素不参与配对，结果仍良定义，不删用例。
# 题内触发点: G12 —— 和的去重按真实签名写 `HashSet::new()`（无容量参数），只能摊还增长。
#   [待补 API] micro new(capacity: usize) -> Self    # 预分配入口（G12），源码不存在
class Solution {
    [export(case: "camelCase")]
    micro distinctAverages(mut nums: [i64]) -> i64 {
        let length: usize = nums.length()
        sort(nums)
        let mut sums: HashSet<i64> = HashSet::new()
        let mut left: usize = 0
        let mut right: usize = length - 1
        while left < right {
            sums.insert(nums⁅left⁆ + nums⁅right⁆)
            left = left + 1
            right = right - 1
        }
        return sums.length() as i64
    }
}
