namespace leetcode.sign_of_the_product_of_an_array;

using std.collection;

# 只看零与负号个数：有零即 0，负号个数为奇数则 -1。
[export(case: "camelCase")]
micro arraySign(nums: ArrayList<i64>) -> i64 {
    let mut negatives: i64 = 0
    let mut position: usize = 0
    while position < nums.length() {
        let value: i64 = nums⁅position⁆
        if value == 0 {
            return 0
        }
        if value < 0 {
            negatives = negatives + 1
        }
        position = position + 1
    }
    if negatives % 2 == 0 {
        return 1
    }
    return -1
}

class Solution {
    micro arraySign(self, nums: ArrayList<i64>): i64 {
        return arraySign(nums)
    }
}
