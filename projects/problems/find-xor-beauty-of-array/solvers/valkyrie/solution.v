namespace leetcode.find_xor_beauty_of_array;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 每个 nums[i] 在全部 (i, j, k) 组合中出现的次数为奇数，故答案等于全体异或。
[export(case: "camelCase")]
micro xor_beauty(nums: ArrayList<i64>) -> i64 {
    let mut result: i64 = 0
    loop x in nums {
        result = result ^ x
    }
    return result
}

class Solution {
    micro xorBeauty(self, nums: ArrayList<i64>): i64 {
        return xor_beauty(nums)
    }
}
