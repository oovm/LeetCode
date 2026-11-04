namespace leetcode.find_first_and_last_position_of_element_in_sorted_array;

using std.collection;

# 两次下界二分：找 ≥ target 的首个位置，找 > target 的首个位置再减一。
# 题内触发点: G3 —— 结果以 `ArrayList<i64>` 返回，命中聚合返回值 bridge 缺口。
micro lower_bound(nums: ArrayList<i64>, target: i64) -> usize {
    let mut low: usize = 0
    let mut high: usize = nums.length()
    while low < high {
        let middle: usize = low + (high - low) / 2
        if nums⁅middle⁆ < target {
            low = middle + 1
        } else {
            high = middle
        }
    }
    return low
}

micro upper_bound(nums: ArrayList<i64>, target: i64) -> usize {
    let mut low: usize = 0
    let mut high: usize = nums.length()
    while low < high {
        let middle: usize = low + (high - low) / 2
        if nums⁅middle⁆ <= target {
            low = middle + 1
        } else {
            high = middle
        }
    }
    return low
}

[export(case: "camelCase")]
micro search_range(nums: ArrayList<i64>, target: i64) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(2)
    let first: usize = lower_bound(nums, target)
    if first == nums.length() || nums⁅first⁆ != target {
        result.push(-1)
        result.push(-1)
        return result
    }

    result.push(first as i64)
    result.push(upper_bound(nums, target) as i64 - 1)
    return result
}

class Solution {
    micro searchRange(self, nums: ArrayList<i64>, target: i64): ArrayList<i64> {
        return search_range(nums, target)
    }
}
