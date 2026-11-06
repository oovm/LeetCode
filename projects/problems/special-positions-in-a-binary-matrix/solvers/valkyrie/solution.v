namespace leetcode.special_positions_in_a_binary_matrix;

using std.collection;

# 先统计每行/每列的 1 的个数，再找行列计数都为 1 的 1。
[export(case: "camelCase")]
micro numSpecial(mat: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = mat.length()
    let columns: usize = mat⁅0⁆.length()
    let mut row_sums: ArrayList<i64> = ArrayList::new(rows)
    let mut fill_row: usize = 0
    while fill_row < rows {
        row_sums.push(0)
        fill_row = fill_row + 1
    }
    let mut column_sums: ArrayList<i64> = ArrayList::new(columns)
    let mut fill_column: usize = 0
    while fill_column < columns {
        column_sums.push(0)
        fill_column = fill_column + 1
    }

    let mut row: usize = 0
    while row < rows {
        let mut column: usize = 0
        while column < columns {
            if mat⁅row⁆⁅column⁆ == 1 {
                row_sums⁅row⁆ = row_sums⁅row⁆ + 1
                column_sums⁅column⁆ = column_sums⁅column⁆ + 1
            }
            column = column + 1
        }
        row = row + 1
    }

    let mut total: i64 = 0
    row = 0
    while row < rows {
        let mut column: usize = 0
        while column < columns {
            if mat⁅row⁆⁅column⁆ == 1 {
                if row_sums⁅row⁆ == 1 {
                    if column_sums⁅column⁆ == 1 {
                        total = total + 1
                    }
                }
            }
            column = column + 1
        }
        row = row + 1
    }
    return total
}

class Solution {
    micro numSpecial(self, mat: ArrayList<ArrayList<i64>>): i64 {
        return numSpecial(mat)
    }
}
