namespace leetcode.longest_subsequence_with_limited_sum;

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

# 升序前缀和上做上界二分，答案即能容纳的个数。
[export(case: "camelCase")]
micro answerQueries(nums: ArrayList<i64>, queries: ArrayList<i64>) -> ArrayList<i64> {
    let ordered: ArrayList<i64> = sortAscending(nums)
    let count: usize = ordered.length()
    let mut prefix: ArrayList<i64> = ArrayList::new(count)
    let mut running: i64 = 0
    let mut index: usize = 0
    while index < count {
        running = running + ordered⁅index⁆
        prefix.push(running)
        index = index + 1
    }
    let mut answer: ArrayList<i64> = ArrayList::new(queries.length())
    index = 0
    while index < queries.length() {
        let limit: i64 = queries⁅index⁆
        let mut low: usize = 0
        let mut high: usize = count
        while low < high {
            let middle: usize = (low + high) / 2
            if prefix⁅middle⁆ <= limit {
                low = middle + 1
            } else {
                high = middle
            }
        }
        answer.push(low as i64)
        index = index + 1
    }
    return answer
}

class Solution {
    micro answerQueries(self, nums: ArrayList<i64>, queries: ArrayList<i64>): ArrayList<i64> {
        return answerQueries(nums, queries)
    }
}
