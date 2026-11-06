namespace leetcode.bitwise_or_of_adjacent_elements;

using std.collection;

# 答案长度为 n-1，第 i 项是相邻两项按位或。
[export(case: "camelCase")]
micro orArray(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut answer: ArrayList<i64> = ArrayList::new(count - 1)
    let mut index: usize = 0
    while index + 1 < count {
        let left: i64 = nums⁅index⁆
        let right: i64 = nums⁅index + 1⁆
        answer.push(left.bit_or(right))
        index = index + 1
    }
    return answer
}

class Solution {
    micro orArray(self, nums: ArrayList<i64>): ArrayList<i64> {
        return orArray(nums)
    }
}
