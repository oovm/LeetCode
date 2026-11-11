namespace leetcode.bitwise_xor_of_all_pairings;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 每对 (i, j) 的异或：nums1[i] 参与 nums2.length 次，nums2[j] 参与 nums1.length 次。
[export(case: "camelCase")]
micro xor_all_nums(nums1: [i64], nums2: [i64]) -> i64 {
    let mut xor1: i64 = 0
    loop x in nums1 {
        xor1 = xor1 ^ x
    }
    let mut xor2: i64 = 0
    loop y in nums2 {
        xor2 = xor2 ^ y
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
    micro xorAllNums(self, nums1: [i64], nums2: [i64]): i64 {
        return xor_all_nums(nums1, nums2)
    }
}
