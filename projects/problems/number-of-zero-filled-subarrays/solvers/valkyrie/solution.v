namespace leetcode.number_of_zero_filled_subarrays;

using std.collection;

# 连续零段长度为 r 时贡献 r*(r+1)/2；用增量累计 run 即可。
[export(case: "camelCase")]
micro zeroFilledSubarray(nums: ArrayList<i64>) -> i64 {
    let mut total: i64 = 0
    let mut run: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        if nums⁅i⁆ == 0 {
            run = run + 1
            total = total + run
        } else {
            run = 0
        }
        i = i + 1
    }
    return total
}

class Solution {
    micro zeroFilledSubarray(self, nums: ArrayList<i64>): i64 {
        return zeroFilledSubarray(nums)
    }
}
