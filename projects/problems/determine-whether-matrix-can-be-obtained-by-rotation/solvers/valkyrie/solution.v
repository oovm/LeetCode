namespace leetcode.determine_whether_matrix_can_be_obtained_by_rotation;

using std.collection;

# 最多旋转四次；每次顺时针旋转后与目标整矩阵比较。
[export(case: "camelCase")]
micro findRotation(mat: ArrayList<ArrayList<i64>>, target: ArrayList<ArrayList<i64>>) -> bool {
    let mut current: ArrayList<ArrayList<i64>> = copyMatrix(mat)
    let mut turn: usize = 0
    while turn < 4 {
        if matrixEquals(current, target) {
            return true
        }
        current = rotateMatrix(current)
        turn = turn + 1
    }
    return false
}

micro copyMatrix(matrix: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = matrix.length()
    let columns: usize = matrix⁅0⁆.length()
    let mut copied: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row: usize = 0
    while row < rows {
        let mut output_row: ArrayList<i64> = ArrayList::new(columns)
        let mut column: usize = 0
        while column < columns {
            output_row.push(matrix⁅row⁆⁅column⁆)
            column = column + 1
        }
        copied.push(output_row)
        row = row + 1
    }
    return copied
}

micro rotateMatrix(matrix: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let n: usize = matrix.length()
    let mut rotated: ArrayList<ArrayList<i64>> = ArrayList::new(n)
    let mut row: usize = 0
    while row < n {
        let mut output_row: ArrayList<i64> = ArrayList::new(n)
        let mut column: usize = 0
        while column < n {
            output_row.push(matrix⁅n - column - 1⁆⁅row⁆)
            column = column + 1
        }
        rotated.push(output_row)
        row = row + 1
    }
    return rotated
}

micro matrixEquals(left: ArrayList<ArrayList<i64>>, right: ArrayList<ArrayList<i64>>) -> bool {
    let rows: usize = left.length()
    let columns: usize = left⁅0⁆.length()
    let mut row: usize = 0
    while row < rows {
        let mut column: usize = 0
        while column < columns {
            if left⁅row⁆⁅column⁆ != right⁅row⁆⁅column⁆ {
                return false
            }
            column = column + 1
        }
        row = row + 1
    }
    return true
}

class Solution {
    micro findRotation(self, mat: ArrayList<ArrayList<i64>>, target: ArrayList<ArrayList<i64>>): bool {
        return findRotation(mat, target)
    }
}
