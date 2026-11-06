namespace leetcode.find_the_distinct_difference_array;

using std.collection;

# 前缀含当前元素，后缀从下一项开始；分别统计两侧去重个数再相减。
[export(case: "camelCase")]
micro distinctDifferenceArray(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()

    let mut prefix: ArrayList<i64> = ArrayList::new(count)
    let mut seen_prefix: HashMap<i64, i64> = HashMap::new(0)
    let mut prefix_count: i64 = 0
    let mut index: usize = 0
    while index < count {
        let value: i64 = nums⁅index⁆
        if !seen_prefix.contains_key(value) {
            seen_prefix.insert(value, 1)
            prefix_count = prefix_count + 1
        }
        prefix.push(prefix_count)
        index = index + 1
    }

    let mut tail: ArrayList<i64> = ArrayList::new(count)
    let mut seen_tail: HashMap<i64, i64> = HashMap::new(0)
    let mut tail_count: i64 = 0
    let mut offset: usize = 0
    while offset < count {
        let position: usize = count - 1 - offset
        tail.push(tail_count)
        let value: i64 = nums⁅position⁆
        if !seen_tail.contains_key(value) {
            seen_tail.insert(value, 1)
            tail_count = tail_count + 1
        }
        offset = offset + 1
    }

    let mut answer: ArrayList<i64> = ArrayList::new(count)
    index = 0
    while index < count {
        let right: i64 = tail⁅count - 1 - index⁆
        answer.push(prefix⁅index⁆ - right)
        index = index + 1
    }
    return answer
}

class Solution {
    micro distinctDifferenceArray(self, nums: ArrayList<i64>): ArrayList<i64> {
        return distinctDifferenceArray(nums)
    }
}
