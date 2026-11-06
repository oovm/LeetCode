namespace leetcode.largest_local_values_in_a_matrix;

using std.collection;

# 以 (row+1, column+1) 为中心取 3×3 最大值，输出尺寸为 (n-2)×(n-2)。
[export(case: "camelCase")]
micro largestLocal(grid: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = grid.length()
    let columns: usize = grid⁅0⁆.length()
    let output_rows: usize = rows - 2
    let output_columns: usize = columns - 2
    let mut answer: ArrayList<ArrayList<i64>> = ArrayList::new(output_rows)
    let mut row: usize = 0
    while row < output_rows {
        let mut output_row: ArrayList<i64> = ArrayList::new(output_columns)
        let mut column: usize = 0
        while column < output_columns {
            let mut best: i64 = grid⁅row⁆⁅column⁆
            let mut row_offset: usize = 0
            while row_offset < 3 {
                let mut column_offset: usize = 0
                while column_offset < 3 {
                    let value: i64 = grid⁅row + row_offset⁆⁅column + column_offset⁆
                    if value > best {
                        best = value
                    }
                    column_offset = column_offset + 1
                }
                row_offset = row_offset + 1
            }
            output_row.push(best)
            column = column + 1
        }
        answer.push(output_row)
        row = row + 1
    }
    return answer
}

class Solution {
    micro largestLocal(self, grid: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return largestLocal(grid)
    }
}
