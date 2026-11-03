namespace leetcode.maximum_xor_for_each_query;

# 逐步移除末尾元素，累计异或与 (1 << maximumBit) - 1 配对即为该次最大值。
[export(case: "camelCase")]
micro get_maximum_xor(nums: ArrayList<i64>, maximumBit: i64) -> ArrayList<i64> {
    let mask: i64 = (1 << maximumBit) - 1
    let mut total: i64 = 0
    loop x in nums {
        total = total ^ x
    }
    let mut answer: ArrayList<i64> = ArrayList::new(nums.length())
    let mut i: usize = nums.length()
    while i > 0 {
        answer.push(total ^ mask)
        i = i - 1
        total = total ^ nums⁅i⁆
    }
    return answer
}

class Solution {
    micro getMaximumXor(self, nums: ArrayList<i64>, maximumBit: i64): ArrayList<i64> {
        return get_maximum_xor(nums, maximumBit)
    }
}
