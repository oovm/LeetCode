namespace leetcode.minimum_difference_between_highest_and_lowest_of_k_scores;

using std.collection;

micro sortAscending(values: ArrayList<i64>) -> ArrayList<i64> {
    let count: usize = values.length()
    let mut ordered: ArrayList<i64> = ArrayList::new(count)
    let mut index: usize = 0
    while index < count {
        ordered.push(values⁅index⁆)
        index = index + 1
    }
    let mut i: usize = 1
    while i < count {
        let key: i64 = ordered⁅i⁆
        let mut j: usize = i
        while j > 0 && ordered⁅j - 1⁆ > key {
            ordered⁅j⁆ = ordered⁅j - 1⁆
            j = j - 1
        }
        ordered⁅j⁆ = key
        i = i + 1
    }
    return ordered
}

# 升序后取任意长度 k 窗口的极差最小值。
[export(case: "camelCase")]
micro minimumDifference(nums: ArrayList<i64>, k: i64) -> i64 {
    let ordered: ArrayList<i64> = sortAscending(nums)
    let mut answer: i64 = ordered⁅ordered.length() - 1⁆ - ordered⁅0⁆
    let mut index: usize = 0
    while index + k as usize <= ordered.length() {
        let difference: i64 = ordered⁅index + k as usize - 1⁆ - ordered⁅index⁆
        if difference < answer {
            answer = difference
        }
        index = index + 1
    }
    return answer
}

class Solution {
    micro minimumDifference(self, nums: ArrayList<i64>, k: i64): i64 {
        return minimumDifference(nums, k)
    }
}
