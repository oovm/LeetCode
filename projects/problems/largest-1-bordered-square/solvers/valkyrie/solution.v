namespace leetcode.largest_1_bordered_square;

using std.collection;

# 预处理每格向下 / 向右的连续 1 长度，再按边长从大到小检查四条边。
# 时间 O(rows * columns * min(rows, columns))，空间 O(rows * columns)。
[export(case: "camelCase")]
micro largest_1_bordered_square(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: i64 = grid.length() as i64
    let first_row: ArrayList<i64> = grid⁅0⁆
    let columns: i64 = first_row.length() as i64
    let cells: usize = (rows * columns) as usize

    let mut down: ArrayList<i64> = ArrayList::new(cells)
    let mut right: ArrayList<i64> = ArrayList::new(cells)
    loop _zero in 0..cells {
        down.push(0)
        right.push(0)
    }

    let mut row: i64 = rows - 1
    while row >= 0 {
        let line: ArrayList<i64> = grid⁅row as usize⁆
        let mut column: i64 = columns - 1
        while column >= 0 {
            if line⁅column as usize⁆ != 0 {
                let offset: usize = (row * columns + column) as usize
                if row + 1 < rows {
                    down⁅offset⁆ = down⁅((row + 1) * columns + column) as usize⁆ + 1
                } else {
                    down⁅offset⁆ = 1
                }
                if column + 1 < columns {
                    right⁅offset⁆ = right⁅(row * columns + column + 1) as usize⁆ + 1
                } else {
                    right⁅offset⁆ = 1
                }
            }
            column = column - 1
        }
        row = row - 1
    }

    let mut limit: i64 = rows
    if columns < limit {
        limit = columns
    }

    let mut side: i64 = limit
    while side >= 1 {
        let mut top: i64 = 0
        while top + side <= rows {
            let mut left: i64 = 0
            while left + side <= columns {
                let top_left: usize = (top * columns + left) as usize
                let top_right: usize = (top * columns + left + side - 1) as usize
                let bottom_left: usize = ((top + side - 1) * columns + left) as usize
                if down⁅top_left⁆ >= side
                    && right⁅top_left⁆ >= side
                    && right⁅bottom_left⁆ >= side
                    && down⁅top_right⁆ >= side {
                    return side * side
                }
                left = left + 1
            }
            top = top + 1
        }
        side = side - 1
    }
    return 0
}

class Solution {
    micro largest1BorderedSquare(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return largest_1_bordered_square(grid)
    }
}
