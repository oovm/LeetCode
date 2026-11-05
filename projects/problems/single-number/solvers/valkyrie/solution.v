namespace leetcode.single_number;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
[export(case: "camelCase")]
micro single_number(nums: ArrayList<i64>) -> i64 {
    let mut ans: i64 = 0
    loop x in nums {
        ans = ans.bit_xor(x)
    }
    return ans
}

class Solution {
    micro singleNumber(self, nums: ArrayList<i64>): i64 {
        return single_number(nums)
    }
}
