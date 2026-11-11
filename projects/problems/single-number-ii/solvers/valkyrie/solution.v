namespace leetcode.single_number_ii;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 逐位统计 1 的个数，模 3 余 1 的位属于只出现一次的数。
[export(case: "camelCase")]
micro single_number(nums: [i64]) -> i64 {
    let mut result: i64 = 0
    let mut bit: i64 = 0
    while bit < 32 {
        let mut ones: i64 = 0
        loop x in nums {
            if ((x >> bit) & 1) == 1 {
                ones = ones + 1
            }
        }
        if ones % 3 == 1 {
            result = result | (1 << bit)
        }
        bit = bit + 1
    }
    if result >= 2147483648 {
        result = result - 4294967296
    }
    return result
}

class Solution {
    micro singleNumber(self, nums: [i64]): i64 {
        return single_number(nums)
    }
}
