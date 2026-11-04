namespace leetcode.number_of_enclaves;

using std.collection;

# 从四条边界向内 DFS，标记能走到边界的陆地；剩下未被标记的陆地就是飞地。
micro push_land(grid: ArrayList<ArrayList<i64>>, mut visited: ArrayList<bool>, cols: usize, row: usize, col: usize, mut stack: Deque<i64>) -> unit {
    let values: ArrayList<i64> = grid⁅row⁆
    if values⁅col⁆ != 1 {
        return
    }
    let index: usize = row * cols + col
    if visited⁅index⁆ {
        return
    }
    visited.set((index + 1) as isize, true)
    stack.push_back(index as i64)
}

[export(case: "camelCase")]
micro numEnclaves(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = grid⁅0⁆.length()
    if cols == 0 {
        return 0
    }

    let mut visited: ArrayList<bool> = ArrayList::new(rows * cols)
    let mut fill: usize = 0
    while fill < rows * cols {
        visited.push(false)
        fill = fill + 1
    }

    let mut stack: Deque<i64> = Deque::new()
    let mut row: usize = 0
    while row < rows {
        let values: ArrayList<i64> = grid⁅row⁆
        let mut col: usize = 0
        while col < cols {
            let boundary: bool = row == 0 || row + 1 == rows || col == 0 || col + 1 == cols
            if boundary && values⁅col⁆ == 1 {
                let index: usize = row * cols + col
                if visited⁅index⁆ == false {
                    visited.set((index + 1) as isize, true)
                    stack.push_back(index as i64)
                }
            }
            col = col + 1
        }
        row = row + 1
    }

    while stack.is_empty() == false {
        let cell: i64 = stack.pop_back().unwrap()
        let current_row: usize = cell as usize / cols
        let current_col: usize = cell as usize % cols
        if current_row > 0 {
            push_land(grid, visited, cols, current_row - 1, current_col, stack)
        }
        if current_row + 1 < rows {
            push_land(grid, visited, cols, current_row + 1, current_col, stack)
        }
        if current_col > 0 {
            push_land(grid, visited, cols, current_row, current_col - 1, stack)
        }
        if current_col + 1 < cols {
            push_land(grid, visited, cols, current_row, current_col + 1, stack)
        }
    }

    let mut total: i64 = 0
    row = 0
    while row < rows {
        let values: ArrayList<i64> = grid⁅row⁆
        let mut col: usize = 0
        while col < cols {
            let index: usize = row * cols + col
            if values⁅col⁆ == 1 && visited⁅index⁆ == false {
                total = total + 1
            }
            col = col + 1
        }
        row = row + 1
    }
    return total
}

class Solution {
    micro numEnclaves(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return numEnclaves(grid)
    }
}
