namespace leetcode.product_of_array_except_self;

using std.collection;

# 前缀积趟写出「左侧之积」，后缀积趟原地乘上「右侧之积」；不使用除法，O(n)。
[export(case: "camelCase")]
micro productExceptSelf(nums: ArrayList<i64>) -> ArrayList<i64> {
    let n: usize = nums.length()
    let mut result: ArrayList<i64> = ArrayList::new(n)
    let mut prefix: i64 = 1
    let mut i: usize = 0
    while i < n {
        result.push(prefix)
        prefix = prefix * nums⁅i⁆
        i = i + 1
    }
    let mut suffix: i64 = 1
    let mut k: i64 = n as i64 - 1
    while k >= 0 {
        result⁅k as usize⁆ = result⁅k as usize⁆ * suffix
        suffix = suffix * nums⁅k as usize⁆
        k = k - 1
    }
    return result
}

class Solution {
    micro productExceptSelf(self, nums: ArrayList<i64>): ArrayList<i64> {
        return productExceptSelf(nums)
    }
}
