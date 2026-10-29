namespace leetcode.concatenation_of_array;

[export(case: "camelCase")]
micro get_concatenation(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(nums.length() * 2)
    let mut i: usize = 0
    while i < nums.length() {
        result.push(nums⁅i⁆.unwrap())
        i = i + 1
    }
    i = 0
    while i < nums.length() {
        result.push(nums⁅i⁆.unwrap())
        i = i + 1
    }
    return result
}

class Solution {
    micro getConcatenation(self, nums: ArrayList<i64>): ArrayList<i64> {
        return get_concatenation(nums)
    }
}
