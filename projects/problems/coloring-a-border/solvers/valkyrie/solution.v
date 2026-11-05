namespace leetcode.coloring_a_border;

using std.collection;

# 从起点连通块做 DFS：越界或邻接异色即为边界，最后统一改色。
micro paint(grid: ArrayList<ArrayList<i64>>, visited: ArrayList<ArrayList<i64>>, i: usize, j: usize, original: i64, color: i64) {
    visited⁅i⁆⁅j⁆ = 1
    let rows: usize = grid.length()
    let cols: usize = grid⁅0⁆.length()
    let mut direction: usize = 0
    while direction < 4 {
        let mut di: i64 = 0
        let mut dj: i64 = 0
        if direction == 0 {
            di = -1
        }
        if direction == 1 {
            di = 1
        }
        if direction == 2 {
            dj = -1
        }
        if direction == 3 {
            dj = 1
        }
        let x: i64 = i as i64 + di
        let y: i64 = j as i64 + dj
        let mut inside: bool = true
        if x < 0 {
            inside = false
        }
        if y < 0 {
            inside = false
        }
        if x >= rows as i64 {
            inside = false
        }
        if y >= cols as i64 {
            inside = false
        }
        if inside {
            let xi: usize = x as usize
            let yi: usize = y as usize
            if visited⁅xi⁆⁅yi⁆ == 0 {
                if grid⁅xi⁆⁅yi⁆ == original {
                    paint(grid, visited, xi, yi, original, color)
                } else {
                    grid⁅i⁆⁅j⁆ = color
                }
            }
        } else {
            grid⁅i⁆⁅j⁆ = color
        }
        direction = direction + 1
    }
}

[export(case: "camelCase")]
micro color_border(grid: ArrayList<ArrayList<i64>>, row: i64, col: i64, color: i64) -> ArrayList<ArrayList<i64>> {
    let rows: usize = grid.length()
    let cols: usize = grid⁅0⁆.length()
    let mut visited: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut r: usize = 0
    while r < rows {
        let mut line: ArrayList<i64> = ArrayList::new(cols)
        let mut c: usize = 0
        while c < cols {
            line.push(0)
            c = c + 1
        }
        visited.push(line)
        r = r + 1
    }
    let original: i64 = grid⁅row as usize⁆⁅col as usize⁆
    paint(grid, visited, row as usize, col as usize, original, color)
    return grid
}

class Solution {
    micro colorBorder(self, grid: ArrayList<ArrayList<i64>>, row: i64, col: i64, color: i64): ArrayList<ArrayList<i64>> {
        return color_border(grid, row, col, color)
    }
}
