namespace leetcode.number_of_closed_islands;

using std.collection;

# 逐格 BFS：土地入队后立刻标记为水，只有从未触边的连通块才算封闭岛。
# 题内触发点: `Deque` 第三面 —— 队首侧 `peek_front` / `pop_front`（此前只压过 back 侧）。
# 题内触发点: 嵌套 `ArrayList` 入参逐层读写 + 原地标记，无新增缺口。
[export(case: "camelCase")]
micro closed_island(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = grid⁅0⁆.length()
    let mut closed: i64 = 0

    let mut row: usize = 0
    while row < rows {
        let mut col: usize = 0
        while col < cols {
            if grid⁅row⁆⁅col⁆ == 0 {
                let mut touches_edge: bool = false
                let mut queue: Deque<i64> = Deque::new()
                queue.push_back((row * cols + col) as i64)
                grid⁅row⁆⁅col⁆ = 1

                while queue.length() > 0 {
                    let cell: i64 = queue.pop_front().unwrap()
                    let current_row: usize = (cell / (cols as i64)) as usize
                    let current_col: usize = (cell % (cols as i64)) as usize
                    if current_row == 0 || current_row == rows - 1 || current_col == 0 || current_col == cols - 1 {
                        touches_edge = true
                    }

                    if current_row > 0 && grid⁅current_row - 1⁆⁅current_col⁆ == 0 {
                        grid⁅current_row - 1⁆⁅current_col⁆ = 1
                        queue.push_back((((current_row - 1) * cols) + current_col) as i64)
                    }
                    if current_row + 1 < rows && grid⁅current_row + 1⁆⁅current_col⁆ == 0 {
                        grid⁅current_row + 1⁆⁅current_col⁆ = 1
                        queue.push_back((((current_row + 1) * cols) + current_col) as i64)
                    }
                    if current_col > 0 && grid⁅current_row⁆⁅current_col - 1⁆ == 0 {
                        grid⁅current_row⁆⁅current_col - 1⁆ = 1
                        queue.push_back(((current_row * cols) + current_col - 1) as i64)
                    }
                    if current_col + 1 < cols && grid⁅current_row⁆⁅current_col + 1⁆ == 0 {
                        grid⁅current_row⁆⁅current_col + 1⁆ = 1
                        queue.push_back(((current_row * cols) + current_col + 1) as i64)
                    }
                }

                if touches_edge == false {
                    closed = closed + 1
                }
            }
            col = col + 1
        }
        row = row + 1
    }
    return closed
}

class Solution {
    micro closedIsland(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return closed_island(grid)
    }
}
