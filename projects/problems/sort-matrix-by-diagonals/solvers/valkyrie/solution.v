namespace leetcode.sort_matrix_by_diagonals;

using std.collection;

micro compare_asc(a: i64, b: i64) -> i32 {
    if a < b {
        return -1
    }
    if a > b {
        return 1
    }
    return 0
}

# 主对角及其下方按降序排列，主对角上方按升序排列；沿对角线方向逐条收集、排序、回填。
[export(case: "camelCase")]
micro sortMatrix(grid: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = grid.length()
    let mut cols: usize = 0
    if rows > 0 {
        cols = grid⁅0⁆.length()
    }

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row_index: usize = 0
    while row_index < rows {
        let source: ArrayList<i64> = grid⁅row_index⁆
        let mut row: ArrayList<i64> = ArrayList::new(cols)
        let mut col_index: usize = 0
        while col_index < cols {
            row.push(source⁅col_index⁆)
            col_index = col_index + 1
        }
        result.push(row)
        row_index = row_index + 1
    }

    let mut start: i64 = rows as i64 - 2
    while start >= 0 {
        let mut values: ArrayList<i64> = ArrayList::new(cols)
        let mut step: usize = 0
        while start as usize + step < rows && step < cols {
            let row: ArrayList<i64> = result⁅start as usize + step⁆
            values.push(row⁅step⁆)
            step = step + 1
        }
        merge_sort(values, compare_asc)
        step = 0
        while step < values.length() {
            let row: ArrayList<i64> = result⁅start as usize + step⁆
            row⁅step⁆ = values⁅values.length() - 1 - step⁆
            step = step + 1
        }
        start = start - 1
    }

    start = rows as i64 - 2
    while start >= 1 {
        let mut values: ArrayList<i64> = ArrayList::new(cols)
        let mut step: usize = 0
        while start as usize >= step && cols - 1 >= step {
            let row: ArrayList<i64> = result⁅start as usize - step⁆
            values.push(row⁅cols - 1 - step⁆)
            step = step + 1
        }
        merge_sort(values, compare_asc)
        step = 0
        while step < values.length() {
            let row: ArrayList<i64> = result⁅start as usize - step⁆
            row⁅cols - 1 - step⁆ = values⁅values.length() - 1 - step⁆
            step = step + 1
        }
        start = start - 1
    }
    return result
}

class Solution {
    micro sortMatrix(self, grid: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return sortMatrix(grid)
    }
}
