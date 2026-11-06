namespace leetcode.transform_array_by_parity;

using std.collection;

# 每个元素替换为奇偶标记后升序，即前半 0、后半 1。
[export(case: "camelCase")]
micro transformArray(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut odd_count: usize = 0
    let mut index: usize = 0
    while index < count {
        if nums⁅index⁆ % 2 != 0 {
            odd_count = odd_count + 1
        }
        index = index + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(count)
    let mut zeros: usize = count - odd_count
    while zeros > 0 {
        answer.push(0)
        zeros = zeros - 1
    }
    let mut ones: usize = odd_count
    while ones > 0 {
        answer.push(1)
        ones = ones - 1
    }
    return answer
}

class Solution {
    micro transformArray(self, nums: ArrayList<i64>): ArrayList<i64> {
        return transformArray(nums)
    }
}
