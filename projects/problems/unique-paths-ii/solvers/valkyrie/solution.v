namespace leetcode.unique_paths_ii;

using std.collection;

# 滚动列 DP：障碍格置 0，否则 dp[j] += dp[j-1]；起点即障碍直接 0。
[export(case: "camelCase")]
micro uniquePathsWithObstacles(obstacleGrid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = obstacleGrid.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = obstacleGrid⁅0⁆.length()
    if obstacleGrid⁅0⁆⁅0⁆ == 1 {
        return 0
    }
    let mut dp: ArrayList<i64> = ArrayList::new(cols)
    let mut slot: usize = 0
    while slot < cols {
        dp.push(0)
        slot = slot + 1
    }
    dp⁅0⁆ = 1
    let mut i: usize = 0
    while i < rows {
        let mut j: usize = 0
        while j < cols {
            if obstacleGrid⁅i⁆⁅j⁆ == 1 {
                dp⁅j⁆ = 0
            } else if j > 0 {
                dp⁅j⁆ = dp⁅j⁆ + dp⁅j - 1⁆
            }
            j = j + 1
        }
        i = i + 1
    }
    return dp⁅cols - 1⁆
}

class Solution {
    micro uniquePathsWithObstacles(self, obstacleGrid: ArrayList<ArrayList<i64>>): i64 {
        return uniquePathsWithObstacles(obstacleGrid)
    }
}
