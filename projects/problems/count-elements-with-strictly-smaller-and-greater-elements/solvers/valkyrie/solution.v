namespace leetcode.count_elements_with_strictly_smaller_and_greater_elements;

using std.collection;

# 统计严格大于最小值且严格小于最大值的元素个数。
[export(case: "camelCase")]
micro countElements(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    if count == 0 {
        return 0
    }
    let mut low: i64 = nums⁅0⁆
    let mut high: i64 = nums⁅0⁆
    let mut index: usize = 1
    while index < count {
        let value: i64 = nums⁅index⁆
        if value < low {
            low = value
        }
        if value > high {
            high = value
        }
        index = index + 1
    }
    let mut total: i64 = 0
    index = 0
    while index < count {
        let value: i64 = nums⁅index⁆
        if value > low && value < high {
            total = total + 1
        }
        index = index + 1
    }
    return total
}

class Solution {
    micro countElements(self, nums: ArrayList<i64>): i64 {
        return countElements(nums)
    }
}
