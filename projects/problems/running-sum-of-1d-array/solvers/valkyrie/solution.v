namespace leetcode.running_sum_of_1d_array;

[export(case: "camelCase")]
micro running_sum(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(nums.length())
    let mut sum: i64 = 0
    let mut i: usize = 0
    while i < nums.length() {
        sum = sum + nums⁅i⁆.unwrap()
        result.push(sum)
        i = i + 1
    }
    return result
}

class Solution {
    micro runningSum(self, nums: ArrayList<i64>): ArrayList<i64> {
        return running_sum(nums)
    }
}
