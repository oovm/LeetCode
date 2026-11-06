namespace leetcode.count_hills_and_valleys_in_an_array;

using std.collection;

# 先去重相邻重复值，再统计局部峰与局部谷的个数。
[export(case: "camelCase")]
micro countHillValley(nums: ArrayList<i64>) -> i64 {
    let mut compact: ArrayList<i64> = ArrayList::new(nums.length())
    let mut index: usize = 0
    while index < nums.length() {
        if index == 0 || nums⁅index⁆ != nums⁅index - 1⁆ {
            compact.push(nums⁅index⁆)
        }
        index = index + 1
    }
    let mut total: i64 = 0
    let mut middle: usize = 1
    while middle + 1 < compact.length() {
        let left: i64 = compact⁅middle - 1⁆
        let center: i64 = compact⁅middle⁆
        let right: i64 = compact⁅middle + 1⁆
        if (center > left && center > right) || (center < left && center < right) {
            total = total + 1
        }
        middle = middle + 1
    }
    return total
}

class Solution {
    micro countHillValley(self, nums: ArrayList<i64>): i64 {
        return countHillValley(nums)
    }
}
