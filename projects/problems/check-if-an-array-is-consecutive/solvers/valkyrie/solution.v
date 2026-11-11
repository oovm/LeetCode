namespace leetcode.check_if_an_array_is_consecutive;

using std.collection;

# 连续数组：元素互不相同且最大值减最小值等于长度减一。
[export(case: "camelCase")]
micro isConsecutive(nums: [i64]) -> bool {
    let count: usize = nums.length()
    if count == 0 {
        return false
    }
    let mut seen: HashSet<i64> = HashSet::new()
    let mut minimum: i64 = nums⁅0⁆
    let mut maximum: i64 = nums⁅0⁆
    let mut index: usize = 0
    while index < count {
        let value: i64 = nums⁅index⁆
        if seen.contains(value) {
            return false
        }
        seen.insert(value)
        if value < minimum {
            minimum = value
        }
        if value > maximum {
            maximum = value
        }
        index = index + 1
    }
    return maximum - minimum == count as i64 - 1
}

class Solution {
    micro isConsecutive(self, nums: [i64]): bool {
        return isConsecutive(nums)
    }
}
