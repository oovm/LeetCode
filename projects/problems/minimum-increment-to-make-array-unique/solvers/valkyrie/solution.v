namespace leetcode.minimum_increment_to_make_array_unique;

using std.collection;

# 升序排列后贪心抬升：当前值不大于前一个值时，抬到前一个值 + 1，差值计入成本。
# `sort(list)` 已在 `std.collection` 落地（`ArrayList<T>` 形态，稳定归并）。
[export(case: "camelCase")]
micro minIncrementForUnique(mut nums: ArrayList<i64>) -> i64 {
    sort(nums)

    let mut cost: i64 = 0
    let mut index: usize = 1
    while index < nums.length() {
        if nums⁅index⁆ <= nums⁅index - 1⁆ {
            let target: i64 = nums⁅index - 1⁆ + 1
            cost = cost + target - nums⁅index⁆
            nums.set((index + 1) as isize, target)
        }
        index = index + 1
    }
    return cost
}

class Solution {
    micro minIncrementForUnique(self, nums: ArrayList<i64>): i64 {
        return minIncrementForUnique(nums)
    }
}
