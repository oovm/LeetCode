namespace leetcode.toeplitz_matrix;

using std.collection;

# 每格只需与左上邻格相等，即可保证整条主对角线一致。
[export(case: "camelCase")]
micro isToeplitzMatrix(matrix: ArrayList<ArrayList<i64>>) -> bool {
    let rows: usize = matrix.length()
    let columns: usize = matrix⁅0⁆.length()
    let mut row: usize = 1
    while row < rows {
        let mut column: usize = 1
        while column < columns {
            if matrix⁅row⁆⁅column⁆ != matrix⁅row - 1⁆⁅column - 1⁆ {
                return false
            }
            column = column + 1
        }
        row = row + 1
    }
    return true
}

class Solution {
    micro isToeplitzMatrix(self, matrix: ArrayList<ArrayList<i64>>): bool {
        return isToeplitzMatrix(matrix)
    }
}
