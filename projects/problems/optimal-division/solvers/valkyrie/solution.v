namespace leetcode.optimal_division;

using std.collection;

# 数值都为整数且大于 1，把除第一个数以外的整段放进括号就是最大值，O(n)。
[export(case: "camelCase")]
micro optimal_division(nums: ArrayList<i64>) -> utf8 {
    let count: usize = nums.length()
    let mut builder: Utf8Builder = Utf8Builder::new(count * 6)
    builder.append_i64(nums⁅0⁆)
    if count == 1 {
        return builder.build()
    }
    if count == 2 {
        builder.append(char::from(47))
        builder.append_i64(nums⁅1⁆)
        return builder.build()
    }
    builder.append(char::from(47))
    builder.append(char::from(40))
    let mut index: usize = 1
    while index < count {
        if index > 1 {
            builder.append(char::from(47))
        }
        builder.append_i64(nums⁅index⁆)
        index = index + 1
    }
    builder.append(char::from(41))
    return builder.build()
}

class Solution {
    micro optimalDivision(self, nums: ArrayList<i64>): utf8 {
        return optimal_division(nums)
    }
}
