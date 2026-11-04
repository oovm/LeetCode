namespace leetcode.single_number;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
[export(case: "camelCase")]
micro single_number(nums: ArrayList<i64>) -> i64 {
    let mut ans: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        ans = ans.bit_xor(nums⁅i⁆)
        i = i + 1
    }
    return ans
}

class Solution {
    micro singleNumber(self, nums: ArrayList<i64>): i64 {
        return single_number(nums)
    }
}
