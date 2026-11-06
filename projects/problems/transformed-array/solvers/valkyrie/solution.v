namespace leetcode.transformed_array;

using std.collection;

# 按 (i + nums[i]) 的环形偏移重建数组，负偏移先补一圈。
[export(case: "camelCase")]
micro constructTransformedArray(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: i64 = nums.length() as i64
    let mut result: ArrayList<i64> = ArrayList::new(nums.length())
    let mut index: i64 = 0
    while index < count {
        let source_index: usize = index as usize
        let offset: i64 = nums⁅source_index⁆
        let mut position: i64 = (index + offset) % count
        if position < 0 {
            position = position + count
        }
        let position_index: usize = position as usize
        result.push(nums⁅position_index⁆)
        index = index + 1
    }
    return result
}

class Solution {
    micro constructTransformedArray(self, nums: ArrayList<i64>): ArrayList<i64> {
        return constructTransformedArray(nums)
    }
}
