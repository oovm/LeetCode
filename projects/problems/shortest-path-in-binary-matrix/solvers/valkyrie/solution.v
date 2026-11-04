namespace leetcode.shortest_path_in_binary_matrix;

using std.collection;

# 8 邻域 BFS，距离用扁平 `ArrayList<i64>`，队列用 `Deque`。
[export(case: "camelCase")]
micro shortestPathBinaryMatrix(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    if rows == 0 {
        return -1
    }
    let cols: usize = rows
    let start_row: ArrayList<i64> = grid⁅0⁆
    if start_row⁅0⁆ != 0 {
        return -1
    }
    let last_row: ArrayList<i64> = grid⁅rows - 1⁆
    if last_row⁅cols - 1⁆ != 0 {
        return -1
    }

    let total: usize = rows * cols
    let mut dist: ArrayList<i64> = ArrayList::new(total)
    let mut fill: usize = 0
    while fill < total {
        dist.push(-1)
        fill = fill + 1
    }
    dist.set(1, 1)

    let mut queue: Deque<i64> = Deque::new()
    queue.push_back(0)

    while queue.is_empty() == false {
        let cell: i64 = queue.pop_front().unwrap()
        let row: i64 = cell / (cols as i64)
        let col: i64 = cell % (cols as i64)
        let current: i64 = dist⁅cell as usize⁆

        let mut drow: i64 = -1
        while drow <= 1 {
            let mut dcol: i64 = -1
            while dcol <= 1 {
                if drow != 0 || dcol != 0 {
                    let next_row: i64 = row + drow
                    let next_col: i64 = col + dcol
                    if next_row >= 0 && next_row < rows as i64 && next_col >= 0 && next_col < cols as i64 {
                        let values: ArrayList<i64> = grid⁅next_row as usize⁆
                        let next: i64 = next_row * (cols as i64) + next_col
                        if values⁅next_col as usize⁆ == 0 && dist⁅next as usize⁆ == -1 {
                            dist.set((next + 1) as isize, current + 1)
                            queue.push_back(next)
                        }
                    }
                }
                dcol = dcol + 1
            }
            drow = drow + 1
        }
    }

    return dist⁅total - 1⁆
}

class Solution {
    micro shortestPathBinaryMatrix(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return shortestPathBinaryMatrix(grid)
    }
}
