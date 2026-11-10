namespace leetcode.check_if_grid_satisfies_conditions;

using std.collection;

# 每列相邻必须相等，每行相邻必须互异：逐格与右邻、下邻对照即可。
[export(case: "camelCase")]
micro satisfiesConditions(grid: ArrayList<ArrayList<i64>>) -> bool {
    let rows: usize = grid.length()
    let columns: usize = grid⁅0⁆.length()
    let mut row: usize = 0
    while row < rows {
        let mut column: usize = 0
        while column < columns {
            if row + 1 < rows && grid⁅row⁆⁅column⁆ != grid⁅row + 1⁆⁅column⁆ {
                return false
            }
            if column + 1 < columns && grid⁅row⁆⁅column⁆ == grid⁅row⁆⁅column + 1⁆ {
                return false
            }
            column = column + 1
        }
        row = row + 1
    }
    return true
}

class Solution {
    micro satisfiesConditions(self, grid: ArrayList<ArrayList<i64>>): bool {
        return satisfiesConditions(grid)
    }
}
