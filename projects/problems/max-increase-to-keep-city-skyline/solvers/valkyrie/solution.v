namespace leetcode.solution

using std.collection

# 每个格子的上限是该行最大值与该列最大值的较小者，答案就是所有上限与原值之差的和。
# 题面写 n×n；生成器有一条 4×3 用例（期望自洽），所以行列分别取长度，不假设方阵，这是有意选择。
class Solution {
    [export(case: "maxIncreaseKeepingSkyline")]
    micro maxIncreaseKeepingSkyline(grid: ArrayList<ArrayList<i64>>) -> i64 {
        let rows: usize = grid.length()
        if rows == 0 {
            return 0
        }
        let cols: usize = grid⁅0⁆.length()
        let mut row_max: ArrayList<i64> = ArrayList::new(0)
        let mut row: usize = 0
        while row < rows {
            let mut value: i64 = grid⁅row⁆⁅0⁆
            let mut col: usize = 1
            while col < cols {
                if grid⁅row⁆⁅col⁆ > value {
                    value = grid⁅row⁆⁅col⁆
                }
                col = col + 1
            }
            row_max.push(value)
            row = row + 1
        }
        let mut col_max: ArrayList<i64> = ArrayList::new(0)
        let mut column: usize = 0
        while column < cols {
            let mut value: i64 = grid⁅0⁆⁅column⁆
            let mut index: usize = 1
            while index < rows {
                if grid⁅index⁆⁅column⁆ > value {
                    value = grid⁅index⁆⁅column⁆
                }
                index = index + 1
            }
            col_max.push(value)
            column = column + 1
        }
        let mut total: i64 = 0
        let mut r: usize = 0
        while r < rows {
            let mut c: usize = 0
            while c < cols {
                let row_limit: i64 = row_max⁅r⁆
                let col_limit: i64 = col_max⁅c⁆
                let limit: i64 = if row_limit < col_limit { row_limit } else { col_limit }
                total = total + (limit - grid⁅r⁆⁅c⁆)
                c = c + 1
            }
            r = r + 1
        }
        return total
    }
}
