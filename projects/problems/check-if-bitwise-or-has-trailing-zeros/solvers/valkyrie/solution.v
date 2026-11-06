namespace leetcode.check_if_bitwise_or_has_trailing_zeros;

using std.collection;

# 两数按位或的末位为零，当且仅当两数都是偶数；因此等价于偶数个数至少为二。
[export(case: "camelCase")]
micro hasTrailingZeros(nums: ArrayList<i64>) -> bool {
    let mut evens: i64 = 0
    loop value in nums {
        if value.bit_and(1) == 0 {
            evens = evens + 1
        }
    }
    return evens >= 2
}

class Solution {
    micro hasTrailingZeros(self, nums: ArrayList<i64>): bool {
        return hasTrailingZeros(nums)
    }
}
