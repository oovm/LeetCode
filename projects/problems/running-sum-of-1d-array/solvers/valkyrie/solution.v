namespace leetcode.running_sum_of_1d_array;

class Solution {
    micro runningSum(self, nums: ArrayList<i64>): ArrayList<i64> {
        let mut result: ArrayList<i64> = ArrayList::new(nums.length())
        let mut sum: i64 = 0
        let mut i: usize = 1
        while i <= nums.length() {
            sum = sum + nums⁅i⁆.unwrap()
            result.push(sum)
            i = i + 1
        }
        return result
    }
}
