namespace leetcode.detect_cycles_in_2d_grid;

using std.collection;

# 迭代 DFS 同时记录当前格与父格，碰到已访问且非父的同类格即为回边，说明存在环。
[export(case: "camelCase")]
micro containsCycle(grid: ArrayList<ArrayList<utf8>>) -> bool {
    let rows: usize = grid.length()
    if rows == 0 {
        return false
    }
    let cols: usize = grid⁅0⁆.length()

    let mut visited: ArrayList<bool> = ArrayList::new(rows * cols)
    let mut fill: usize = 0
    while fill < rows * cols {
        visited.push(false)
        fill = fill + 1
    }

    let mut row: usize = 0
    while row < rows {
        let mut col: usize = 0
        while col < cols {
            let start: usize = row * cols + col
            if visited⁅start⁆ == false {
                let mut cells: ArrayList<i64> = ArrayList::new(rows * cols)
                let mut parents: ArrayList<i64> = ArrayList::new(rows * cols)
                visited.set((start + 1) as isize, true)
                cells.push(start as i64)
                parents.push(-1)

                while cells.length() > 0 {
                    let cell: i64 = cells.pop().unwrap()
                    let parent: i64 = parents.pop().unwrap()
                    let current_row: usize = cell as usize / cols
                    let current_col: usize = cell as usize % cols
                    let current_values: ArrayList<utf8> = grid⁅current_row⁆
                    let cell_text: utf8 = current_values⁅current_col⁆
                    let mark: char = cell_text.character_at(0)

                    if current_row > 0 {
                        let next_index: usize = (current_row - 1) * cols + current_col
                        let next_values: ArrayList<utf8> = grid⁅current_row - 1⁆
                        let next_text: utf8 = next_values⁅current_col⁆
                        let next_mark: char = next_text.character_at(0)
                        if next_mark == mark && next_index as i64 != parent {
                            if visited⁅next_index⁆ {
                                return true
                            }
                            visited.set((next_index + 1) as isize, true)
                            cells.push(next_index as i64)
                            parents.push(cell)
                        }
                    }
                    if current_row + 1 < rows {
                        let next_index: usize = (current_row + 1) * cols + current_col
                        let next_values: ArrayList<utf8> = grid⁅current_row + 1⁆
                        let next_text: utf8 = next_values⁅current_col⁆
                        let next_mark: char = next_text.character_at(0)
                        if next_mark == mark && next_index as i64 != parent {
                            if visited⁅next_index⁆ {
                                return true
                            }
                            visited.set((next_index + 1) as isize, true)
                            cells.push(next_index as i64)
                            parents.push(cell)
                        }
                    }
                    if current_col > 0 {
                        let next_index: usize = current_row * cols + current_col - 1
                        let next_text: utf8 = current_values⁅current_col - 1⁆
                        let next_mark: char = next_text.character_at(0)
                        if next_mark == mark && next_index as i64 != parent {
                            if visited⁅next_index⁆ {
                                return true
                            }
                            visited.set((next_index + 1) as isize, true)
                            cells.push(next_index as i64)
                            parents.push(cell)
                        }
                    }
                    if current_col + 1 < cols {
                        let next_index: usize = current_row * cols + current_col + 1
                        let next_text: utf8 = current_values⁅current_col + 1⁆
                        let next_mark: char = next_text.character_at(0)
                        if next_mark == mark && next_index as i64 != parent {
                            if visited⁅next_index⁆ {
                                return true
                            }
                            visited.set((next_index + 1) as isize, true)
                            cells.push(next_index as i64)
                            parents.push(cell)
                        }
                    }
                }
            }
            col = col + 1
        }
        row = row + 1
    }
    return false
}

class Solution {
    micro containsCycle(self, grid: ArrayList<ArrayList<utf8>>): bool {
        return containsCycle(grid)
    }
}
