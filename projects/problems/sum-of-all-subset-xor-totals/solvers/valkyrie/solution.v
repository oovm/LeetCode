namespace leetcode.sum_of_all_subset_xor_totals;

using std.collection;

# 逐位贡献：某位只要出现在任一元素中，恰有半数子集该位为 1，贡献 `bit * 2^(n-1)`。
micro bit_shift(n: i64, k: i64) -> i64 {
    return n.bit_shift_left(k)
}

[export(case: "camelCase")]
micro subsetXORSum(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut bit: i64 = 0
    while bit < 32 {
        let mut present: bool = false
        loop value in nums {
            if value.bit_shift_right(bit).bit_and(1) == 1 {
                present = true
            }
        }
        if present {
            total = total + bit_shift(1, bit) * bit_shift(1, nums.length() as i64 - 1)
        }
        bit = bit + 1
    }
    return total
}

class Solution {
    micro subsetXORSum(self, nums: ArrayList<i64>): i64 {
        return subsetXORSum(nums)
    }
}
