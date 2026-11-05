namespace leetcode.minimum_score_triangulation_of_polygon;

using std.collection;

# 区间 DP：dp[i][j] 为多边形 i..j 的最小三角剖分得分，按跨度递增填表。
[export(case: "camelCase")]
micro min_score_triangulation(values: ArrayList<i64>) -> i64 {
    let count: usize = values.length()
    if count < 3 {
        return 0
    }
    let mut table: ArrayList<i64> = ArrayList::new(count * count)
    let mut fill: usize = 0
    while fill < count * count {
        table.push(0)
        fill = fill + 1
    }
    let mut span: usize = 2
    while span < count {
        let mut left: usize = 0
        while left + span < count {
            let right: usize = left + span
            let mut best: i64 = -1
            let mut middle: usize = left + 1
            while middle < right {
                let score: i64 = table⁅left * count + middle⁆ + table⁅middle * count + right⁆ + values⁅left⁆ * values⁅middle⁆ * values⁅right⁆
                if best < 0 {
                    best = score
                } else if score < best {
                    best = score
                }
                middle = middle + 1
            }
            table⁅left * count + right⁆ = best
            left = left + 1
        }
        span = span + 1
    }
    return table⁅count - 1⁆
}

class Solution {
    micro minScoreTriangulation(self, values: ArrayList<i64>): i64 {
        return min_score_triangulation(values)
    }
}
