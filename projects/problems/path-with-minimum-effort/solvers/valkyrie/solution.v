namespace leetcode.path_with_minimum_effort;

using std.collection;

# 在 effort 阈值上二分，每次用 BFS 判定只走相邻高度差不超过阈值的边能否从左上到右下。
micro effort_reachable(limit: i64, heights: ArrayList<ArrayList<i64>>, rows: usize, cols: usize) -> bool {
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
        let here_row: ArrayList<i64> = heights⁅row as usize⁆
        let here: i64 = here_row⁅col as usize⁆
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
                            let next_row_values: ArrayList<i64> = heights⁅next_row as usize⁆
                            let there: i64 = next_row_values⁅next_col as usize⁆
                            let mut diff: i64 = here - there
                            if diff < 0 {
                                diff = 0 - diff
                            }
                            if diff <= limit {
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
micro minimumEffortPath(heights: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = heights.length()
    let cols: usize = heights⁅0⁆.length()

    let mut low: i64 = 0
    let mut high: i64 = 1000000
    while low < high {
        let middle: i64 = (low + high) / 2
        if effort_reachable(middle, heights, rows, cols) {
            high = middle
        } else {
            low = middle + 1
        }
    }
    return low
}

class Solution {
    micro minimumEffortPath(self, heights: ArrayList<ArrayList<i64>>): i64 {
        return minimumEffortPath(heights)
    }
}
