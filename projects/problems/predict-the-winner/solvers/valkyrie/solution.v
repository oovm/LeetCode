namespace leetcode.predict_the_winner;

using std.collection;

# 区间 DP：dp[i][j] = max(nums[i] - dp[i+1][j], nums[j] - dp[i][j-1])；非负即先手胜。
[export(case: "camelCase")]
micro predictTheWinner(nums: ArrayList<i64>) -> bool {
    let n: usize = nums.length()
    let mut dp: ArrayList<ArrayList<i64>> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        let mut row: ArrayList<i64> = ArrayList::new(n)
        let mut j: usize = 0
        while j < n {
            row.push(0)
            j = j + 1
        }
        dp.push(row)
        i = i + 1
    }
    i = 0
    while i < n {
        dp⁅i⁆⁅i⁆ = nums⁅i⁆
        i = i + 1
    }
    let mut length: usize = 2
    while length <= n {
        let mut start: usize = 0
        while start + length - 1 < n {
            let end: usize = start + length - 1
            let left: i64 = nums⁅start⁆ - dp⁅start + 1⁆⁅end⁆
            let right: i64 = nums⁅end⁆ - dp⁅start⁆⁅end - 1⁆
            if left > right {
                dp⁅start⁆⁅end⁆ = left
            } else {
                dp⁅start⁆⁅end⁆ = right
            }
            start = start + 1
        }
        length = length + 1
    }
    return dp⁅0⁆⁅n - 1⁆ >= 0
}

class Solution {
    micro predictTheWinner(self, nums: ArrayList<i64>): bool {
        return predictTheWinner(nums)
    }
}
