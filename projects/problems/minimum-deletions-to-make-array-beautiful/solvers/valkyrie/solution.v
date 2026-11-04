namespace leetcode.minimum_deletions_to_make_array_beautiful;

using std.collection;

# 美丽数组要求长度为偶数，且每个偶数下标的元素与后一个元素不相等。
# 贪心：栈长为偶数时直接入栈；为奇数时只有与栈顶不相等才入栈。
# 结束时若栈长为奇数，再删掉末尾一个。
[export(case: "camelCase")]
micro minDeletion(nums: ArrayList<i64>) -> i64 {
    let mut stack: ArrayList<i64> = ArrayList::new(nums.length())
    let mut index: usize = 0
    while index < nums.length() {
        let value: i64 = nums⁅index⁆
        if stack.length() % 2 == 0 {
            stack.push(value)
        } else {
            if stack.last().unwrap() != value {
                stack.push(value)
            }
        }
        index = index + 1
    }
    if stack.length() % 2 == 1 {
        stack.pop()
    }
    return (nums.length() - stack.length()) as i64
}

class Solution {
    micro minDeletion(self, nums: ArrayList<i64>): i64 {
        return minDeletion(nums)
    }
}
