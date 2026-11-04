namespace leetcode.single_number_iii;

# 先取全部异或得到两个目标数的差异位，再按该位分组异或。
[export(case: "camelCase")]
micro single_number(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut merged: i64 = 0
    let mut loop_index_7: usize = 0
    while loop_index_7 < nums.length() {
        let x: i64 = nums⁅loop_index_7⁆
            merged = merged ^ x
        loop_index_7 = loop_index_7 + 1
    }
    let bit: i64 = merged & (0 - merged)
    let mut first: i64 = 0
    let mut second: i64 = 0
    let mut loop_index_13: usize = 0
    while loop_index_13 < nums.length() {
        let x: i64 = nums⁅loop_index_13⁆
            if (x & bit) != 0 {
                first = first ^ x
            } else {
                second = second ^ x
            }
        loop_index_13 = loop_index_13 + 1
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
