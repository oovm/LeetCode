namespace leetcode.missing_ranges;

# 把 `lower - 1` 与 `upper + 1` 当作哨兵：相邻两个已出现值的差 >= 2 就是一段缺失区间。
[export(case: "camelCase")]
micro findMissingRanges(nums: ArrayList<i64>, lower: i64, upper: i64) -> ArrayList<ArrayList<i64>> {
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(nums.length() + 1)
    let mut previous: i64 = lower - 1
    let mut i: usize = 0
    while i < nums.length() {
        let value: i64 = nums⁅i⁆
        if value - previous >= 2 {
            let mut range: ArrayList<i64> = ArrayList::new(2)
            range.push(previous + 1)
            range.push(value - 1)
            result.push(range)
        }
        previous = value
        i = i + 1
    }
    let sentinel: i64 = upper + 1
    if sentinel - previous >= 2 {
        let mut range: ArrayList<i64> = ArrayList::new(2)
        range.push(previous + 1)
        range.push(upper)
        result.push(range)
    }
    return result
}

class Solution {
    micro findMissingRanges(self, nums: ArrayList<i64>, lower: i64, upper: i64): ArrayList<ArrayList<i64>> {
        return findMissingRanges(nums, lower, upper)
    }
}
