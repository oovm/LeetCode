namespace leetcode.shift_2d_grid;

using std.collection;

# 展平成一维后整体右移 k 位，再按下标写回二维形状。
[export(case: "camelCase")]
micro shiftGrid(grid: ArrayList<ArrayList<i64>>, k: i64) -> ArrayList<ArrayList<i64>> {
    let rows: usize = grid.length()
    let columns: usize = grid⁅0⁆.length()
    let total: usize = rows * columns
    let shift: usize = (k % (total as i64)) as usize

    let mut answer: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row: usize = 0
    while row < rows {
        let mut values: ArrayList<i64> = ArrayList::new(columns)
        let mut column: usize = 0
        while column < columns {
            values.push(0)
            column = column + 1
        }
        answer.push(values)
        row = row + 1
    }

    let mut flat: usize = 0
    while flat < total {
        let target: usize = (flat + shift) % total
        let source_row: usize = flat / columns
        let source_column: usize = flat % columns
        let target_row: usize = target / columns
        let target_column: usize = target % columns
        answer⁅target_row⁆⁅target_column⁆ = grid⁅source_row⁆⁅source_column⁆
        flat = flat + 1
    }
    return answer
}

class Solution {
    micro shiftGrid(self, grid: ArrayList<ArrayList<i64>>, k: i64): ArrayList<ArrayList<i64>> {
        return shiftGrid(grid, k)
    }
}
