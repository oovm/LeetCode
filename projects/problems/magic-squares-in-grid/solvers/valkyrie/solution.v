namespace leetcode.magic_squares_in_grid;

using std.collection;

# 枚举所有 3x3 窗口，用 1..9 的计数表判重，再核对四条边与两条对角线之和相等。
# 每个窗口常数代价，整体 O(m * n)。
micro check(grid: ArrayList<ArrayList<i64>>, top: usize, left: usize) -> i64 {
    let mut seen: ArrayList<i64> = ArrayList::new(10)
    let mut slot: usize = 0
    while slot < 10 {
        seen.push(0)
        slot = slot + 1
    }
    let mut rows: ArrayList<i64> = ArrayList::new(3)
    let mut cols: ArrayList<i64> = ArrayList::new(3)
    rows.push(0)
    rows.push(0)
    rows.push(0)
    cols.push(0)
    cols.push(0)
    cols.push(0)
    let mut diagonal: i64 = 0
    let mut opposite: i64 = 0
    let mut dr: usize = 0
    while dr < 3 {
        let mut dc: usize = 0
        while dc < 3 {
            let value: i64 = grid⁅top + dr⁆⁅left + dc⁆
            if value < 1 || value > 9 {
                return 0
            }
            seen⁅value as usize⁆ = seen⁅value as usize⁆ + 1
            rows⁅dr⁆ = rows⁅dr⁆ + value
            cols⁅dc⁆ = cols⁅dc⁆ + value
            if dr == dc {
                diagonal = diagonal + value
            }
            if dr + dc == 2 {
                opposite = opposite + value
            }
            dc = dc + 1
        }
        dr = dr + 1
    }
    let mut digit: usize = 1
    while digit <= 9 {
        if seen⁅digit⁆ != 1 {
            return 0
        }
        digit = digit + 1
    }
    if diagonal != opposite {
        return 0
    }
    let mut line: usize = 0
    while line < 3 {
        if rows⁅line⁆ != diagonal || cols⁅line⁆ != diagonal {
            return 0
        }
        line = line + 1
    }
    return 1
}

[export(case: "camelCase")]
micro num_magic_squares_inside(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let height: usize = grid.length()
    let mut width: usize = 0
    if height > 0 {
        width = grid⁅0⁆.length()
    }
    let mut total: i64 = 0
    let mut top: usize = 0
    while top + 3 <= height {
        let mut left: usize = 0
        while left + 3 <= width {
            total = total + check(grid, top, left)
            left = left + 1
        }
        top = top + 1
    }
    return total
}

class Solution {
    micro numMagicSquaresInside(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return num_magic_squares_inside(grid)
    }
}
