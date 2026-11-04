namespace leetcode.count_sub_islands;

using std.collection;

# 在 `grid2` 上做 DFS 找出岛屿，同时检查该岛屿每个格子在 `grid1` 是否也是陆地。
[export(case: "camelCase")]
micro countSubIslands(grid1: ArrayList<ArrayList<i64>>, grid2: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid1.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = grid1⁅0⁆.length()

    let mut visited: ArrayList<bool> = ArrayList::new(rows * cols)
    let mut fill: usize = 0
    while fill < rows * cols {
        visited.push(false)
        fill = fill + 1
    }

    let mut total: i64 = 0
    let mut row: usize = 0
    while row < rows {
        let values: ArrayList<i64> = grid2⁅row⁆
        let mut col: usize = 0
        while col < cols {
            let start: usize = row * cols + col
            if values⁅col⁆ == 1 && visited⁅start⁆ == false {
                let mut all_inside: bool = true
                let mut stack: Deque<i64> = Deque::new()
                visited.set((start + 1) as isize, true)
                stack.push_back(start as i64)

                while stack.is_empty() == false {
                    let cell: i64 = stack.pop_back().unwrap()
                    let current_row: usize = cell as usize / cols
                    let current_col: usize = cell as usize % cols
                    let first_values: ArrayList<i64> = grid1⁅current_row⁆
                    if first_values⁅current_col⁆ != 1 {
                        all_inside = false
                    }
                    let current_values: ArrayList<i64> = grid2⁅current_row⁆

                    if current_row > 0 {
                        let target: usize = (current_row - 1) * cols + current_col
                        let next_values: ArrayList<i64> = grid2⁅current_row - 1⁆
                        if next_values⁅current_col⁆ == 1 && visited⁅target⁆ == false {
                            visited.set((target + 1) as isize, true)
                            stack.push_back(target as i64)
                        }
                    }
                    if current_row + 1 < rows {
                        let target: usize = (current_row + 1) * cols + current_col
                        let next_values: ArrayList<i64> = grid2⁅current_row + 1⁆
                        if next_values⁅current_col⁆ == 1 && visited⁅target⁆ == false {
                            visited.set((target + 1) as isize, true)
                            stack.push_back(target as i64)
                        }
                    }
                    if current_col > 0 {
                        let target: usize = current_row * cols + current_col - 1
                        if current_values⁅current_col - 1⁆ == 1 && visited⁅target⁆ == false {
                            visited.set((target + 1) as isize, true)
                            stack.push_back(target as i64)
                        }
                    }
                    if current_col + 1 < cols {
                        let target: usize = current_row * cols + current_col + 1
                        if current_values⁅current_col + 1⁆ == 1 && visited⁅target⁆ == false {
                            visited.set((target + 1) as isize, true)
                            stack.push_back(target as i64)
                        }
                    }
                }

                if all_inside {
                    total = total + 1
                }
            }
            col = col + 1
        }
        row = row + 1
    }
    return total
}

class Solution {
    micro countSubIslands(self, grid1: ArrayList<ArrayList<i64>>, grid2: ArrayList<ArrayList<i64>>): i64 {
        return countSubIslands(grid1, grid2)
    }
}
