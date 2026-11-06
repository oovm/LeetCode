namespace leetcode.minimum_subsequence_in_non_increasing_order;

using std.collection;

# 插入排序降序后，贪心取前缀直到其和大于剩余和。
[export(case: "camelCase")]
micro minSubsequence(nums: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = nums.length()
    let mut ordered: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        ordered.push(nums⁅index⁆)
        index = index + 1
    }
    let mut i: usize = 1
    while i < count {
        let key: i64 = ordered⁅i⁆
        let mut j: usize = i
        while j > 0 && ordered⁅j - 1⁆ < key {
            ordered⁅j⁆ = ordered⁅j - 1⁆
            j = j - 1
        }
        ordered⁅j⁆ = key
        i = i + 1
    }
    let mut total: i64 = 0
    index = 0
    while index < count {
        total = total + ordered⁅index⁆
        index = index + 1
    }
    let mut result: ArrayList<i64> = ArrayList::new(count)
    let mut running: i64 = 0
    index = 0
    while index < count {
        let value: i64 = ordered⁅index⁆
        result.push(value)
        running = running + value
        if running > total - running {
            break
        }
        index = index + 1
    }
    return result
}

class Solution {
    micro minSubsequence(self, nums: ArrayList<i64>): ArrayList<i64> {
        return minSubsequence(nums)
    }
}
