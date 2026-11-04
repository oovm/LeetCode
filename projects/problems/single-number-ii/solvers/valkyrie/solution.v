namespace leetcode.single_number_ii;

# 逐位统计 1 的个数，模 3 余 1 的位属于只出现一次的数。
[export(case: "camelCase")]
micro single_number(nums: ArrayList<i64>) -> i64 {
    let mut result: i64 = 0
    let mut bit: i64 = 0
    while bit < 32 {
        let mut ones: i64 = 0
        let mut loop_index_10: usize = 0
        while loop_index_10 < nums.length() {
            let x: i64 = nums⁅loop_index_10⁆
                if ((x >> bit) & 1) == 1 {
                    ones = ones + 1
                }
            loop_index_10 = loop_index_10 + 1
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
    micro singleNumber(self, nums: ArrayList<i64>): i64 {
        return single_number(nums)
    }
}
