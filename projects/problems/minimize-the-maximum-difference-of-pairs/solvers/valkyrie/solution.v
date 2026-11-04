namespace leetcode.minimize_the_maximum_difference_of_pairs;

using std.collection;

# 先排序，再二分答案：最大差值 `limit` 单调可行。
# 可行性检查：相邻两数差值不超过 `limit` 就成对，跳过这两个。
micro pairs_within(nums: ArrayList<i64>, limit: i64) -> i64 {
    let mut pairs: i64 = 0
    let mut index: usize = 0
    while index + 1 < nums.length() {
        if nums⁅index + 1⁆ - nums⁅index⁆ <= limit {
            pairs = pairs + 1
            index = index + 2
        } else {
            index = index + 1
        }
    }
    return pairs
}

[export(case: "camelCase")]
micro minimizeMax(nums: ArrayList<i64>, p: i64) -> i64 {
    let mut ordered: ArrayList<i64> = ArrayList::new(nums.length())
    loop value in nums {
        ordered.push(value)
    }
    sort(ordered)

    let mut low: i64 = 0
    let mut high: i64 = ordered⁅ordered.length() - 1⁆ - ordered⁅0⁆
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if pairs_within(ordered, mid) >= p {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro minimizeMax(self, nums: ArrayList<i64>, p: i64): i64 {
        return minimizeMax(nums, p)
    }
}
