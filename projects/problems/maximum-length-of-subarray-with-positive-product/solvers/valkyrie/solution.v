namespace leetcode.maximum_length_of_subarray_with_positive_product;

using std.collection;

# 记录以当前位置结尾的最长正积、负积长度；遇 0 清零，一趟 O(n)。
[export(case: "camelCase")]
micro getMaxLen(nums: ArrayList<i64>) -> i64 {
    let mut positive: i64 = 0
    let mut negative: i64 = 0
    let mut best: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        let value: i64 = nums⁅i⁆
        if value > 0 {
            positive = positive + 1
            if negative > 0 {
                negative = negative + 1
            }
        } else if value < 0 {
            let next_positive: i64 = negative + 1
            let next_negative: i64 = positive + 1
            if negative == 0 {
                positive = 0
            } else {
                positive = next_positive
            }
            negative = next_negative
        } else {
            positive = 0
            negative = 0
        }
        if positive > best {
            best = positive
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro getMaxLen(self, nums: ArrayList<i64>): i64 {
        return getMaxLen(nums)
    }
}
