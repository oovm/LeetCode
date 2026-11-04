namespace leetcode.minimize_maximum_pair_sum_in_array;

using std.collection;

# 排序后首尾配对：最小配最大、次小配次大，最大配对和最小。
[export(case: "camelCase")]
micro minPairSum(nums: ArrayList<i64>) -> i64 {
    let mut values: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        values.push(value)
    }
    sort(values)

    let mut left: usize = 0
    let mut right: usize = values.length() - 1
    let mut best: i64 = 0
    while left < right {
        let sum: i64 = values⁅left⁆ + values⁅right⁆
        if sum > best {
            best = sum
        }
        left = left + 1
        right = right - 1
    }
    return best
}

class Solution {
    micro minPairSum(self, nums: ArrayList<i64>): i64 {
        return minPairSum(nums)
    }
}
