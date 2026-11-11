namespace leetcode.solution

using std.collection

# 先量出从每个起点开始能连续严格递增多长，再看相邻两段长度是否都 >= k。
micro strict_run(nums: [i64], start: usize, limit: usize) -> i64 {
    let mut length: i64 = 1
    let mut index: usize = start
    while index + 1 < limit && nums⁅index⁆ < nums⁅index + 1⁆ {
        length = length + 1
        index = index + 1
    }
    return length
}

class Solution {
    [export(case: "camelCase")]
    micro hasIncreasingSubarrays(nums: [i64], k: i64) -> bool {
        let count: usize = nums.length()
        let need: usize = k as usize
        if need == 0 || need * 2 > count {
            return false
        }
        let mut start: usize = 0
        while start + need * 2 <= count {
            if strict_run(nums, start, count) >= k && strict_run(nums, start + need, count) >= k {
                return true
            }
            start = start + 1
        }
        return false
    }
}
