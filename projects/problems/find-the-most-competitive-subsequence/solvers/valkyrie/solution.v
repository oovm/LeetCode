namespace leetcode.find_the_most_competitive_subsequence;

using std.collection;

# 单调递增栈：从左到右能删就删，最多删 count - k 个，栈内留下最小字典序。
[export(case: "camelCase")]
micro mostCompetitive(nums: ArrayList<i64>, k: i64) -> ArrayList<i64> {
    let count: usize = nums.length()
    let keep: usize = k as usize
    let mut remove: usize = count - keep

    let mut stack: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        let value: i64 = nums⁅index⁆
        while remove > 0 && stack.is_empty() == false && stack.last().unwrap() > value {
            stack.pop()
            remove = remove - 1
        }
        stack.push(value)
        index = index + 1
    }

    while remove > 0 {
        stack.pop()
        remove = remove - 1
    }

    let mut result: ArrayList<i64> = ArrayList::new(keep)
    let mut cursor: usize = 0
    while cursor < keep {
        result.push(stack⁅cursor⁆)
        cursor = cursor + 1
    }
    return result
}

class Solution {
    micro mostCompetitive(self, nums: ArrayList<i64>, k: i64): ArrayList<i64> {
        return mostCompetitive(nums, k)
    }
}
