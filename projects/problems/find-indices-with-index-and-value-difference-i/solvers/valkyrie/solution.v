namespace leetcode.find_indices_with_index_and_value_difference_i;

using std.collection;

# 维护已扫描前缀里的最小值与最大值下标，逐个检查跨过 indexDifference 后能否满足数值差。
[export(case: "camelCase")]
micro findIndices(nums: ArrayList<i64>, indexDifference: i64, valueDifference: i64) -> ArrayList<i64> {
    let mut answer: ArrayList<i64> = ArrayList::new(2)
    let count: i64 = nums.length() as i64
    let mut minimum_index: i64 = 0
    let mut maximum_index: i64 = 0
    let mut current: i64 = indexDifference
    while current < count {
        let previous: i64 = current - indexDifference
        if nums⁅previous as usize⁆ < nums⁅minimum_index as usize⁆ {
            minimum_index = previous
        }
        if nums⁅previous as usize⁆ > nums⁅maximum_index as usize⁆ {
            maximum_index = previous
        }
        if nums⁅current as usize⁆ - nums⁅minimum_index as usize⁆ >= valueDifference {
            answer.push(minimum_index)
            answer.push(current)
            return answer
        }
        if nums⁅maximum_index as usize⁆ - nums⁅current as usize⁆ >= valueDifference {
            answer.push(maximum_index)
            answer.push(current)
            return answer
        }
        current = current + 1
    }
    answer.push(-1)
    answer.push(-1)
    return answer
}

class Solution {
    micro findIndices(self, nums: ArrayList<i64>, indexDifference: i64, valueDifference: i64): ArrayList<i64> {
        return findIndices(nums, indexDifference, valueDifference)
    }
}
