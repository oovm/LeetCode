namespace leetcode.total_hamming_distance;

# 临时绕过：`loop <var> in <ArrayList>` 当前编译不报错但运行期零迭代，这里改用显式索引循环；`IntoIterator` 合同恢复后还原为 `loop ... in`。
# 每位的贡献为 1 的个数乘 0 的个数。
[export(case: "camelCase")]
micro total_hamming_distance(nums: ArrayList<i64>) -> i64 {
    let n: i64 = nums.length() as i64
    let mut total: i64 = 0
    let mut bit: i64 = 0
    while bit < 32 {
        let mut ones: i64 = 0
        let mut loop_index_11: usize = 0
        while loop_index_11 < nums.length() {
            let x: i64 = nums⁅loop_index_11⁆
                if ((x >> bit) & 1) == 1 {
                    ones = ones + 1
                }
            loop_index_11 = loop_index_11 + 1
        }
        total = total + ones * (n - ones)
        bit = bit + 1
    }
    return total
}

class Solution {
    micro totalHammingDistance(self, nums: ArrayList<i64>): i64 {
        return total_hamming_distance(nums)
    }
}
