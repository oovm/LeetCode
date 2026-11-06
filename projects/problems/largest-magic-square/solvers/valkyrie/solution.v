namespace leetcode.largest_magic_square;

using std.collection;

# 从最大可能边长向下枚举，逐格验证行、列、两条对角线之和是否相等；无 2 阶以上则返回 1。
[export(case: "camelCase")]
micro largestMagicSquare(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = grid⁅0⁆.length()
    let mut limit: usize = rows
    if cols < limit {
        limit = cols
    }

    let mut side: usize = limit
    while side >= 2 {
        let mut top: usize = 0
        while top + side <= rows {
            let mut left: usize = 0
            while left + side <= cols {
                let mut target: i64 = 0
                let first_row: ArrayList<i64> = grid⁅top⁆
                let mut offset: usize = 0
                while offset < side {
                    target = target + first_row⁅left + offset⁆
                    offset = offset + 1
                }

                let mut magic: bool = true
                let mut line: usize = 0
                while line < side {
                    let row: ArrayList<i64> = grid⁅top + line⁆
                    let mut row_sum: i64 = 0
                    let mut offset: usize = 0
                    while offset < side {
                        row_sum = row_sum + row⁅left + offset⁆
                        offset = offset + 1
                    }
                    if row_sum != target {
                        magic = false
                    }
                    line = line + 1
                }

                if magic {
                    let mut column: usize = 0
                    while column < side {
                        let mut column_sum: i64 = 0
                        let mut line: usize = 0
                        while line < side {
                            let row: ArrayList<i64> = grid⁅top + line⁆
                            column_sum = column_sum + row⁅left + column⁆
                            line = line + 1
                        }
                        if column_sum != target {
                            magic = false
                        }
                        column = column + 1
                    }
                }

                if magic {
                    let mut diagonal: i64 = 0
                    let mut anti: i64 = 0
                    let mut offset: usize = 0
                    while offset < side {
                        let row: ArrayList<i64> = grid⁅top + offset⁆
                        diagonal = diagonal + row⁅left + offset⁆
                        anti = anti + row⁅left + side - 1 - offset⁆
                        offset = offset + 1
                    }
                    if diagonal != target || anti != target {
                        magic = false
                    }
                }

                if magic {
                    return side as i64
                }
                left = left + 1
            }
            top = top + 1
        }
        if side == 2 {
            break
        }
        side = side - 1
    }
    return 1
}

class Solution {
    micro largestMagicSquare(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return largestMagicSquare(grid)
    }
}
