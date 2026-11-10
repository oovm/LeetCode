namespace leetcode.sum_of_good_numbers;

using std.collection;

# 好数 = 与左邻 k 位或右邻 k 位相等；逐格两侧各查一次即可，O(n)。
[export(case: "camelCase")]
micro sumOfGoodNumbers(nums: ArrayList<i64>, k: i64) -> i64 {
    let n: usize = nums.length()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < n {
        let mut good: bool = false
        if i >= k as usize && nums⁅i - k as usize⁆ == nums⁅i⁆ {
            good = true
        }
        if i + k as usize < n && nums⁅i + k as usize⁆ == nums⁅i⁆ {
            good = true
        }
        if good {
            total = total + nums⁅i⁆
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro sumOfGoodNumbers(self, nums: ArrayList<i64>, k: i64): i64 {
        return sumOfGoodNumbers(nums, k)
    }
}
