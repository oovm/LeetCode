namespace leetcode.partition_array_into_disjoint_intervals;

using std.collection;

# 先算后缀最小值，再从左维护前缀最大值：第一个满足 `前缀最大值 <= 后缀最小值` 的分界
# 就是最短左区间，O(n)。
[export(case: "camelCase")]
micro partitionDisjoint(nums: ArrayList<i64>) -> i64 {
    let count: usize = nums.length()
    let mut suffix: ArrayList<i64> = ArrayList::new(count)
    let mut i: usize = 0
    while i < count {
        suffix.push(0)
        i = i + 1
    }
    suffix⁅count - 1⁆ = nums⁅count - 1⁆
    let mut j: i64 = count as i64 - 2
    while j >= 0 {
        let current: i64 = nums⁅j as usize⁆
        let next_min: i64 = suffix⁅(j + 1) as usize⁆
        if current < next_min {
            suffix⁅j as usize⁆ = current
        } else {
            suffix⁅j as usize⁆ = next_min
        }
        j = j - 1
    }

    let mut left_max: i64 = nums⁅0⁆
    let mut split: usize = 0
    while split < count - 1 {
        if left_max <= suffix⁅split + 1⁆ {
            return (split + 1) as i64
        }
        let value: i64 = nums⁅split + 1⁆
        if value > left_max {
            left_max = value
        }
        split = split + 1
    }
    return count as i64
}

class Solution {
    micro partitionDisjoint(self, nums: ArrayList<i64>): i64 {
        return partitionDisjoint(nums)
    }
}
