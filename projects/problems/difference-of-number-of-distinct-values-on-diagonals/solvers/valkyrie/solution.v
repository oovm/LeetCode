namespace leetcode.difference_of_number_of_distinct_values_on_diagonals;

using std.collection;

# 每个格子分别统计左上、右下两条对角线上不同值的个数，取差的绝对值。
[export(case: "camelCase")]
micro differenceOfDistinctValues(grid: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = grid.length()
    let mut cols: usize = 0
    if rows > 0 {
        cols = grid⁅0⁆.length()
    }

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row_index: usize = 0
    while row_index < rows {
        let mut row: ArrayList<i64> = ArrayList::new(cols)
        let mut col_index: usize = 0
        while col_index < cols {
            let mut upper: ArrayList<i64> = ArrayList::new(cols)
            let mut step: usize = 0
            while step < row_index && step < col_index {
                step = step + 1
                let diagonal_row: ArrayList<i64> = grid⁅row_index - step⁆
                let value: i64 = diagonal_row⁅col_index - step⁆
                if !upper.contains(value) {
                    upper.push(value)
                }
            }

            let mut lower: ArrayList<i64> = ArrayList::new(cols)
            step = 1
            while row_index + step < rows && col_index + step < cols {
                let diagonal_row: ArrayList<i64> = grid⁅row_index + step⁆
                let value: i64 = diagonal_row⁅col_index + step⁆
                if !lower.contains(value) {
                    lower.push(value)
                }
                step = step + 1
            }

            let mut difference: i64 = upper.length() as i64 - lower.length() as i64
            if difference < 0 {
                difference = -difference
            }
            row.push(difference)
            col_index = col_index + 1
        }
        result.push(row)
        row_index = row_index + 1
    }
    return result
}

class Solution {
    micro differenceOfDistinctValues(self, grid: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return differenceOfDistinctValues(grid)
    }
}
