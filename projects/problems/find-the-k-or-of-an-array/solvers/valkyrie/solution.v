namespace leetcode.find_the_k_or_of_an_array;

using std.collection;

# 逐位统计置 1 的数的个数；达到 k 的位合成进结果。
[export(case: "camelCase")]
micro findKOr(nums: ArrayList<i64>, k: i64) -> i64 {
    let mut result: i64 = 0
    let mut bit: usize = 0
    while bit < 32 {
        let mut count: i64 = 0
        loop value in nums {
            if value.bit_shift_right(bit as u32).bit_and(1) == 1 {
                count = count + 1
            }
        }
        if count >= k {
            result = result.bit_or((1 as i64).bit_shift_left(bit))
        }
        bit = bit + 1
    }
    return result
}

class Solution {
    micro findKOr(self, nums: ArrayList<i64>, k: i64): i64 {
        return findKOr(nums, k)
    }
}
