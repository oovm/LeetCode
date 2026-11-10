namespace leetcode.binary_prefix_divisible_by_5;

using std.collection;

# 前缀值只保留模 5 余数：`value = (value * 2 + bit) % 5`，逐位判定余数是否为 0。
[export(case: "camelCase")]
micro prefixesDivBy5(nums: ArrayList<i64>) -> ArrayList<bool> {
    let mut out: ArrayList<bool> = ArrayList::new(nums.length())
    let mut value: i64 = 0
    loop bit in nums {
        value = (value * 2 + bit) % 5
        out.push(value == 0)
    }
    return out
}

class Solution {
    micro prefixesDivBy5(self, nums: ArrayList<i64>): ArrayList<bool> {
        return prefixesDivBy5(nums)
    }
}
