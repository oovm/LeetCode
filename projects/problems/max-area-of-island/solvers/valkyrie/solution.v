namespace leetcode.solution

using std.collection

# 网格 DFS：把访问过的陆地改成 0，就地充当 visited，不另开标记表。
micro sink(grid: ArrayList<ArrayList<i64>>, row: usize, col: usize, rows: usize, cols: usize) -> i64 {
    if grid⁅row⁆⁅col⁆ == 0 {
        return 0
    }
    grid⁅row⁆⁅col⁆ = 0
    let mut area: i64 = 1
    if row > 0 {
        area = area + sink(grid, row - 1, col, rows, cols)
    }
    if row + 1 < rows {
        area = area + sink(grid, row + 1, col, rows, cols)
    }
    if col > 0 {
        area = area + sink(grid, row, col - 1, rows, cols)
    }
    if col + 1 < cols {
        area = area + sink(grid, row, col + 1, rows, cols)
    }
    return area
}

class Solution {
    [export(case: "camelCase")]
    micro maxAreaOfIsland(grid: ArrayList<ArrayList<i64>>) -> i64 {
        let rows: usize = grid.length()
        if rows == 0 {
            return 0
        }
        let cols: usize = grid⁅0⁆.length()
        let mut best: i64 = 0
        let mut row: usize = 0
        while row < rows {
            let mut col: usize = 0
            while col < cols {
                if grid⁅row⁆⁅col⁆ == 1 {
                    let area: i64 = sink(grid, row, col, rows, cols)
                    if area > best {
                        best = area
                    }
                }
                col = col + 1
            }
            row = row + 1
        }
        return best
    }
}
