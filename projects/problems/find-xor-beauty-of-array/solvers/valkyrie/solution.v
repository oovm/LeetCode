namespace leetcode.find_xor_beauty_of_array;

# 每个 nums[i] 在全部 (i, j, k) 组合中出现的次数为奇数，故答案等于全体异或。
[export(case: "camelCase")]
micro xor_beauty(nums: ArrayList<i64>) -> i64 {
    let mut result: i64 = 0
    let mut loop_index_7: usize = 0
    while loop_index_7 < nums.length() {
        let x: i64 = nums⁅loop_index_7⁆
            result = result ^ x
        loop_index_7 = loop_index_7 + 1
    }
    return result
}

class Solution {
    micro xorBeauty(self, nums: ArrayList<i64>): i64 {
        return xor_beauty(nums)
    }
}
