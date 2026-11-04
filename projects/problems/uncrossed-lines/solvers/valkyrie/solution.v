namespace leetcode.uncrossed_lines;

using std.collection;

# 等价于两序列的最长公共子序列：dp[i][j] 用滚动的一整张二维表。
[export(case: "camelCase")]
micro maxUncrossedLines(nums1: ArrayList<i64>, nums2: ArrayList<i64>) -> i64 {
    let m: usize = nums1.length()
    let n: usize = nums2.length()
    let mut dp: ArrayList<ArrayList<i64>> = ArrayList::new(m + 1)
    let mut row_index: usize = 0
    while row_index <= m {
        let mut row: ArrayList<i64> = ArrayList::new(n + 1)
        let mut column: usize = 0
        while column <= n {
            row.push(0)
            column = column + 1
        }
        dp.push(row)
        row_index = row_index + 1
    }

    let mut i: usize = 1
    while i <= m {
        let x: i64 = nums1⁅i - 1⁆
        let mut j: usize = 1
        while j <= n {
            let y: i64 = nums2⁅j - 1⁆
            if x == y {
                dp⁅i⁆⁅j⁆ = dp⁅i - 1⁆⁅j - 1⁆ + 1
            } else {
                let up: i64 = dp⁅i - 1⁆⁅j⁆
                let left: i64 = dp⁅i⁆⁅j - 1⁆
                if up > left {
                    dp⁅i⁆⁅j⁆ = up
                } else {
                    dp⁅i⁆⁅j⁆ = left
                }
            }
            j = j + 1
        }
        i = i + 1
    }
    return dp⁅m⁆⁅n⁆
}

class Solution {
    micro maxUncrossedLines(self, nums1: ArrayList<i64>, nums2: ArrayList<i64>): i64 {
        return maxUncrossedLines(nums1, nums2)
    }
}
