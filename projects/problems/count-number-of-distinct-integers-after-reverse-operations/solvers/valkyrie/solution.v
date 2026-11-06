namespace leetcode.solution

using std.collection

# 题内触发点: G12 —— 去重集合按真实签名写 `HashSet::new()`；该入口不接受容量参数，
# 本题元素总量上界 = 2 * nums.length()，无法预分配，只能摊还增长。
#   [待补 API] micro new(capacity: usize) -> Self    # 预分配入口（G12），源码不存在
micro reverse_number(value: i64) -> i64 {
    let mut rest: i64 = value
    let mut reversed: i64 = 0
    while rest > 0 {
        reversed = reversed * 10 + (rest % 10)
        rest = rest / 10
    }
    return reversed
}

class Solution {
    [export(case: "camelCase")]
    micro countDistinctIntegers(nums: ArrayList<i64>) -> i64 {
        let mut seen: HashSet<i64> = HashSet::new()
        loop value in nums {
            seen.insert(value)
            seen.insert(reverse_number(value))
        }
        return seen.length() as i64
    }
}
