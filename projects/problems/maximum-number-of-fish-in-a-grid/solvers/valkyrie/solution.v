namespace leetcode.maximum_number_of_fish_in_a_grid;

using std.collection;

# 对每块未访问的水域做一次 DFS，累加鱼数并更新最大值。
[export(case: "camelCase")]
micro findMaxFish(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = grid⁅0⁆.length()

    let mut visited: ArrayList<bool> = ArrayList::new(rows * cols)
    let mut fill: usize = 0
    while fill < rows * cols {
        visited.push(false)
        fill = fill + 1
    }

    let mut best: i64 = 0
    let mut row: usize = 0
    while row < rows {
        let values: ArrayList<i64> = grid⁅row⁆
        let mut col: usize = 0
        while col < cols {
            let start: usize = row * cols + col
            if values⁅col⁆ > 0 && visited⁅start⁆ == false {
                let mut total: i64 = 0
                let mut stack: Deque<i64> = Deque::new()
                visited.set((start + 1) as isize, true)
                stack.push_back(start as i64)

                while stack.is_empty() == false {
                    let cell: i64 = stack.pop_back().unwrap()
                    let current_row: usize = cell as usize / cols
                    let current_col: usize = cell as usize % cols
                    let current_values: ArrayList<i64> = grid⁅current_row⁆
                    total = total + current_values⁅current_col⁆

                    if current_row > 0 {
                        let target: usize = (current_row - 1) * cols + current_col
                        let next_values: ArrayList<i64> = grid⁅current_row - 1⁆
                        if next_values⁅current_col⁆ > 0 && visited⁅target⁆ == false {
                            visited.set((target + 1) as isize, true)
                            stack.push_back(target as i64)
                        }
                    }
                    if current_row + 1 < rows {
                        let target: usize = (current_row + 1) * cols + current_col
                        let next_values: ArrayList<i64> = grid⁅current_row + 1⁆
                        if next_values⁅current_col⁆ > 0 && visited⁅target⁆ == false {
                            visited.set((target + 1) as isize, true)
                            stack.push_back(target as i64)
                        }
                    }
                    if current_col > 0 {
                        let target: usize = current_row * cols + current_col - 1
                        if current_values⁅current_col - 1⁆ > 0 && visited⁅target⁆ == false {
                            visited.set((target + 1) as isize, true)
                            stack.push_back(target as i64)
                        }
                    }
                    if current_col + 1 < cols {
                        let target: usize = current_row * cols + current_col + 1
                        if current_values⁅current_col + 1⁆ > 0 && visited⁅target⁆ == false {
                            visited.set((target + 1) as isize, true)
                            stack.push_back(target as i64)
                        }
                    }
                }

                if total > best {
                    best = total
                }
            }
            col = col + 1
        }
        row = row + 1
    }
    return best
}

class Solution {
    micro findMaxFish(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return findMaxFish(grid)
    }
}
