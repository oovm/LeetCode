namespace leetcode.matrix_cells_in_distance_order;

# 按曼哈顿距离从小到大扫描所有格子。
[export(case: "camelCase")]
micro all_cells_dist_order(rows: i64, cols: i64, rCenter: i64, cCenter: i64) -> ArrayList<ArrayList<i64>> {
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new((rows * cols) as usize)
    let mut distance: i64 = 0
    while distance <= rows + cols {
        let mut row: i64 = 0
        while row < rows {
            let mut column: i64 = 0
            while column < cols {
                let mut dr: i64 = row - rCenter
                if dr < 0 {
                    dr = 0 - dr
                }
                let mut dc: i64 = column - cCenter
                if dc < 0 {
                    dc = 0 - dc
                }
                if dr + dc == distance {
                    let mut cell: ArrayList<i64> = ArrayList::new(2)
                    cell.push(row)
                    cell.push(column)
                    result.push(cell)
                }
                column = column + 1
            }
            row = row + 1
        }
        distance = distance + 1
    }
    return result
}

class Solution {
    micro allCellsDistOrder(self, rows: i64, cols: i64, rCenter: i64, cCenter: i64): ArrayList<ArrayList<i64>> {
        return all_cells_dist_order(rows, cols, rCenter, cCenter)
    }
}
