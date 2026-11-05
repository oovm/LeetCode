namespace leetcode.maximum_xor_after_operations;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 每次把某个数与 2^b-1 相与只会清位，所有元素能贡献的位并集即按位或。
[export(name: "maximumXOR")]
micro maximum_x_o_r(nums: ArrayList<i64>) -> i64 {
    let mut result: i64 = 0
    loop x in nums {
        result = result | x
    }
    return result
}

class Solution {
    micro maximumXOR(self, nums: ArrayList<i64>): i64 {
        return maximum_x_o_r(nums)
    }
}
