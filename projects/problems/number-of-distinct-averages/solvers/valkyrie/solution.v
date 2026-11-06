namespace leetcode.solution

using std.collection

# 题内触发点: G12 —— 二元组的和去重，按真实签名写 `HashSet::new()`（无容量参数），
# 可知上界 C(n,2) 却无法预分配，只能摊还增长。
#   [待补 API] micro new(capacity: usize) -> Self    # 预分配入口（G12），源码不存在
# 题面要求长度偶数；生成器用例存在奇数长度，但「两两平均值的种数」仍良定义，解法按 i64 通用处理，不删用例。
class Solution {
    [export(case: "camelCase")]
    micro distinctAverages(nums: ArrayList<i64>) -> i64 {
        let length: usize = nums.length()
        let mut sums: HashSet<i64> = HashSet::new()
        let mut left: usize = 0
        while left < length {
            let mut right: usize = left + 1
            while right < length {
                sums.insert(nums⁅left⁆ + nums⁅right⁆)
                right = right + 1
            }
            left = left + 1
        }
        return sums.length() as i64
    }
}
