namespace leetcode.check_if_matrix_is_x_matrix;

using std.collection;

# 主、副对角线上的格子必须非零，其余格子必须为零。
[export(case: "camelCase")]
micro checkXMatrix(grid: ArrayList<ArrayList<i64>>) -> bool {
    let n: usize = grid.length()
    let mut row: usize = 0
    while row < n {
        let mut column: usize = 0
        while column < n {
            let on_diagonal: bool = row == column || row + column == n - 1
            if on_diagonal {
                if grid⁅row⁆⁅column⁆ == 0 {
                    return false
                }
            } else {
                if grid⁅row⁆⁅column⁆ != 0 {
                    return false
                }
            }
            column = column + 1
        }
        row = row + 1
    }
    return true
}

class Solution {
    micro checkXMatrix(self, grid: ArrayList<ArrayList<i64>>): bool {
        return checkXMatrix(grid)
    }
}
