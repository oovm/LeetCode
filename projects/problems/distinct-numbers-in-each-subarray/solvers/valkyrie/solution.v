namespace leetcode.distinct_numbers_in_each_subarray;

using std.collection;

# 固定长度窗口滑动，用计数器维护窗口内不同值的个数。
[export(case: "camelCase")]
micro distinctNumbers(nums: ArrayList<i64>, k: i64) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut answer: ArrayList<i64> = ArrayList::new(count)
    if k <= 0 || k as usize > count {
        return answer
    }
    let window: usize = k as usize

    let mut counts: HashMap<i64, i64> = HashMap::new(count)
    let mut distinct: i64 = 0
    let mut index: usize = 0
    while index < window {
        let value: i64 = nums⁅index⁆
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
            distinct = distinct + 1
        }
        index = index + 1
    }
    answer.push(distinct)

    index = window
    while index < count {
        let leaving: i64 = nums⁅index - window⁆
        let remaining: i64 = counts.get(leaving).unwrap() - 1
        if remaining == 0 {
            counts.remove(leaving)
            distinct = distinct - 1
        } else {
            counts.insert(leaving, remaining)
        }

        let value: i64 = nums⁅index⁆
        if counts.contains_key(value) {
            counts.insert(value, counts.get(value).unwrap() + 1)
        } else {
            counts.insert(value, 1)
            distinct = distinct + 1
        }
        answer.push(distinct)
        index = index + 1
    }
    return answer
}

class Solution {
    micro distinctNumbers(self, nums: ArrayList<i64>, k: i64): ArrayList<i64> {
        return distinctNumbers(nums, k)
    }
}
