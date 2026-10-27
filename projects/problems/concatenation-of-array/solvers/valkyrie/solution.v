namespace leetcode.concatenation_of_array;

class Solution {
    micro getConcatenation(self, nums: ArrayList<i64>): ArrayList<i64> {
        let mut result: ArrayList<i64> = ArrayList::new(nums.length() * 2)
        let mut i: usize = 1
        while i <= nums.length() {
            result.push(nums⁅i⁆.unwrap())
            i = i + 1
        }
        i = 1
        while i <= nums.length() {
            result.push(nums⁅i⁆.unwrap())
            i = i + 1
        }
        return result
    }
}
