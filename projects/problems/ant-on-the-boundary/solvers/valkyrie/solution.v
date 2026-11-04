namespace leetcode.solution

using std.collection

# 前缀位移：每走一步累加，位置回到 0 就记一次（起点不算）。
class Solution {
    [export(case: "returnToBoundaryCount")]
    micro returnToBoundaryCount(nums: ArrayList<i64>) -> i64 {
        let mut position: i64 = 0
        let mut count: i64 = 0
        loop step in nums {
            position = position + step
            if position == 0 {
                count = count + 1
            }
        }
        return count
    }
}
