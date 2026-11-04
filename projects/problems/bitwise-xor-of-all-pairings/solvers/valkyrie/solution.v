namespace leetcode.bitwise_xor_of_all_pairings;

# 临时绕过：`loop <var> in <ArrayList>` 在 OVM 后端因 `Cast` lowering 缺失而编译期失败（fail-closed 前表现为运行期零迭代），这里改用显式索引循环；OVM 后端 `Cast` lowering 落地后还原为 `loop ... in`。
# 每对 (i, j) 的异或：nums1[i] 参与 nums2.length 次，nums2[j] 参与 nums1.length 次。
[export(case: "camelCase")]
micro xor_all_nums(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> i64 {
    let mut xor1: i64 = 0
    let mut loop_index_7: usize = 0
    while loop_index_7 < nums1.length() {
        let x: i64 = nums1⁅loop_index_7⁆
            xor1 = xor1 ^ x
        loop_index_7 = loop_index_7 + 1
    }
    let mut xor2: i64 = 0
    let mut loop_index_11: usize = 0
    while loop_index_11 < nums2.length() {
        let y: i64 = nums2⁅loop_index_11⁆
            xor2 = xor2 ^ y
        loop_index_11 = loop_index_11 + 1
    }
    let mut result: i64 = 0
    if nums2.length() % 2 == 1 {
        result = result ^ xor1
    }
    if nums1.length() % 2 == 1 {
        result = result ^ xor2
    }
    return result
}

class Solution {
    micro xorAllNums(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): i64 {
        return xor_all_nums(nums1, nums2)
    }
}
