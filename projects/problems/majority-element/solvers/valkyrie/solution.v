namespace leetcode.majority_element;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
[export(case: "camelCase")]
micro majority_element(nums: ArrayList<i64>) -> i64 {
    let mut candidate: i64 = nums⁅0⁆
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        let x: i64 = nums⁅i⁆
        if count == 0 {
            candidate = x
            count = 1
        } else if x == candidate {
            count = count + 1
        } else {
            count = count - 1
        }
        i = i + 1
    }
    return candidate
}

class Solution {
    micro majorityElement(self, nums: ArrayList<i64>): i64 {
        return majority_element(nums)
    }
}
