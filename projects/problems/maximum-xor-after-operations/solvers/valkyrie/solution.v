namespace leetcode.maximum_xor_after_operations;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
# 每次把某个数与 2^b-1 相与只会清位，所有元素能贡献的位并集即按位或。
[export(name: "maximumXOR")]
micro maximum_x_o_r(nums: ArrayList<i64>) -> i64 {
    let mut result: i64 = 0
    let mut loop_index_7: usize = 0
    while loop_index_7 < nums.length() {
        let x: i64 = nums⁅loop_index_7⁆
            result = result | x
        loop_index_7 = loop_index_7 + 1
    }
    return result
}

class Solution {
    micro maximumXOR(self, nums: ArrayList<i64>): i64 {
        return maximum_x_o_r(nums)
    }
}
