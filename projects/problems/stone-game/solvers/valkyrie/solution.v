namespace leetcode.stone_game;

using std.collection;

# 区间博弈 DP：`dp[i][j]` 为「先手在 piles[i..j] 上能领先的最大分差」。
# 转移 `max(piles[i] - dp[i+1][j], piles[j] - dp[i][j-1])`，按区间长度递增填表，O(n^2)。
[export(case: "camelCase")]
micro stone_game(piles: ArrayList<i64>) -> bool {
    let n: usize = piles.length()
    let mut dp: ArrayList<i64> = ArrayList::new(n * n)
    let mut fill: usize = 0
    while fill < n * n {
        dp.push(0)
        fill = fill + 1
    }
    let mut span: usize = 1
    while span <= n {
        let mut left: usize = 0
        while left + span <= n {
            let right: usize = left + span - 1
            if span == 1 {
                dp⁅left * n + right⁆ = piles⁅left⁆
            } else {
                let take_left: i64 = piles⁅left⁆ - dp⁅(left + 1) * n + right⁆
                let take_right: i64 = piles⁅right⁆ - dp⁅left * n + right - 1⁆
                if take_left > take_right {
                    dp⁅left * n + right⁆ = take_left
                } else {
                    dp⁅left * n + right⁆ = take_right
                }
            }
            left = left + 1
        }
        span = span + 1
    }
    return dp⁅0 * n + n - 1⁆ > 0
}

class Solution {
    micro stoneGame(self, piles: ArrayList<i64>): bool {
        return stone_game(piles)
    }
}
