namespace leetcode.total_hamming_distance;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 每位的贡献为 1 的个数乘 0 的个数。
[export(case: "camelCase")]
micro total_hamming_distance(nums: [i64]) -> i64 {
    let n: i64 = nums.length() as i64
    let mut total: i64 = 0
    let mut bit: i64 = 0
    while bit < 32 {
        let mut ones: i64 = 0
        loop x in nums {
            if ((x >> bit) & 1) == 1 {
                ones = ones + 1
            }
        }
        total = total + ones * (n - ones)
        bit = bit + 1
    }
    return total
}

class Solution {
    micro totalHammingDistance(self, nums: [i64]): i64 {
        return total_hamming_distance(nums)
    }
}
