namespace leetcode.single_number_iii;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 先取全部异或得到两个目标数的差异位，再按该位分组异或。
[export(case: "camelCase")]
micro single_number(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut merged: i64 = 0
    loop x in nums {
        merged = merged ^ x
    }
    let bit: i64 = merged & (0 - merged)
    let mut first: i64 = 0
    let mut second: i64 = 0
    loop x in nums {
        if (x & bit) != 0 {
            first = first ^ x
        } else {
            second = second ^ x
        }
    }
    let mut out: ArrayList<i64> = ArrayList::new(2)
    out.push(first)
    out.push(second)
    return out
}

class Solution {
    micro singleNumber(self, nums: ArrayList<i64>): ArrayList<i64> {
        return single_number(nums)
    }
}
