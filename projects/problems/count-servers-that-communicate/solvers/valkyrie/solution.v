namespace leetcode.count_servers_that_communicate;

using std.collection;

# 行 / 列各统计一次服务器数量，同一行或同一列有第二台即与其他服务器通信。
[export(case: "camelCase")]
micro countServers(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    let mut cols: usize = 0
    if rows > 0 {
        cols = grid⁅0⁆.length()
    }

    let mut row_count: ArrayList<i64> = ArrayList::new(rows)
    let mut col_count: ArrayList<i64> = ArrayList::new(cols)
    let mut fill: usize = 0
    while fill < rows {
        row_count.push(0)
        fill = fill + 1
    }
    fill = 0
    while fill < cols {
        col_count.push(0)
        fill = fill + 1
    }

    let mut row: usize = 0
    while row < rows {
        let values: ArrayList<i64> = grid⁅row⁆
        let mut col: usize = 0
        while col < cols {
            if values⁅col⁆ == 1 {
                row_count.set((row as i64 + 1) as isize, row_count⁅row⁆ + 1)
                col_count.set((col as i64 + 1) as isize, col_count⁅col⁆ + 1)
            }
            col = col + 1
        }
        row = row + 1
    }

    let mut total: i64 = 0
    row = 0
    while row < rows {
        let values: ArrayList<i64> = grid⁅row⁆
        let mut col: usize = 0
        while col < cols {
            if values⁅col⁆ == 1 && (row_count⁅row⁆ > 1 || col_count⁅col⁆ > 1) {
                total = total + 1
            }
            col = col + 1
        }
        row = row + 1
    }
    return total
}

class Solution {
    micro countServers(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return countServers(grid)
    }
}
