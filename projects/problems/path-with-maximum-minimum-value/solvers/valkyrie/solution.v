namespace leetcode.path_with_maximum_minimum_value;

using std.collection;

# 对路径最小值二分，每次用 BFS 判定只走数值不小于该值的格子能否连通左上与右下。
micro score_reachable(limit: i64, grid: ArrayList<ArrayList<i64>>, rows: usize, cols: usize) -> bool {
    let start_row: ArrayList<i64> = grid⁅0⁆
    if start_row⁅0⁆ < limit {
        return false
    }

    let total: usize = rows * cols
    let mut visited: ArrayList<bool> = ArrayList::new(total)
    let mut fill: usize = 0
    while fill < total {
        visited.push(false)
        fill = fill + 1
    }
    visited.set(1, true)

    let mut queue: Deque<i64> = Deque::new()
    queue.push_back(0)

    while queue.is_empty() == false {
        let cell: i64 = queue.pop_front().unwrap()
        if cell == total as i64 - 1 {
            return true
        }
        let row: i64 = cell / (cols as i64)
        let col: i64 = cell % (cols as i64)
        let mut drow: i64 = -1
        while drow <= 1 {
            let mut dcol: i64 = -1
            while dcol <= 1 {
                let orthogonal: bool = (drow == 0 || dcol == 0) && (drow != 0 || dcol != 0)
                if orthogonal {
                    let next_row: i64 = row + drow
                    let next_col: i64 = col + dcol
                    if next_row >= 0 && next_row < rows as i64 && next_col >= 0 && next_col < cols as i64 {
                        let next: i64 = next_row * (cols as i64) + next_col
                        let next_index: usize = next as usize
                        if visited⁅next_index⁆ == false {
                            let next_row_values: ArrayList<i64> = grid⁅next_row as usize⁆
                            if next_row_values⁅next_col as usize⁆ >= limit {
                                visited.set((next + 1) as isize, true)
                                queue.push_back(next)
                            }
                        }
                    }
                }
                dcol = dcol + 1
            }
            drow = drow + 1
        }
    }
    return false
}

[export(case: "camelCase")]
micro maximumMinimumPath(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    let cols: usize = grid⁅0⁆.length()

    let mut low: i64 = 0
    let mut high: i64 = 1000000000
    while low < high {
        let middle: i64 = (low + high + 1) / 2
        if score_reachable(middle, grid, rows, cols) {
            low = middle
        } else {
            high = middle - 1
        }
    }
    return low
}

class Solution {
    micro maximumMinimumPath(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return maximumMinimumPath(grid)
    }
}
