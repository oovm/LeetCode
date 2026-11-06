namespace leetcode.construct_the_minimum_bitwise_array_i;

using std.collection;

# 对每个目标值枚举最小 x，使 (x | (x+1)) == target；无解记 -1。
[export(case: "camelCase")]
micro minBitwiseArray(nums: ArrayList<i64>) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(nums.length())
    let mut index: usize = 0
    while index < nums.length() {
        let target: i64 = nums⁅index⁆
        let mut answer: i64 = -1
        let mut candidate: i64 = 0
        while candidate < target {
            if candidate.bit_or(candidate + 1) == target {
                answer = candidate
                break
            }
            candidate = candidate + 1
        }
        result.push(answer)
        index = index + 1
    }
    return result
}

class Solution {
    micro minBitwiseArray(self, nums: ArrayList<i64>): ArrayList<i64> {
        return minBitwiseArray(nums)
    }
}
