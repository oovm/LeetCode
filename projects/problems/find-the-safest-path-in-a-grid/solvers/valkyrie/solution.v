namespace leetcode.find_the_safest_path_in_a_grid;

using std.collection;

# 曼哈顿 BFS 用 4 邻域；判定也只用 4 邻域，与题面「上下左右相邻」一致。
micro reachable(limit: i64, safeness: ArrayList<i64>, n: usize) -> bool {
    let total: usize = n * n
    if safeness⁅0⁆ < limit {
        return false
    }

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
        let current_row: i64 = cell / (n as i64)
        let current_col: i64 = cell % (n as i64)
        let mut drow: i64 = -1
        while drow <= 1 {
            let mut dcol: i64 = -1
            while dcol <= 1 {
                let orthogonal: bool = (drow == 0 || dcol == 0) && (drow != 0 || dcol != 0)
                if orthogonal {
                    let next_row: i64 = current_row + drow
                    let next_col: i64 = current_col + dcol
                    if next_row >= 0 && next_row < n as i64 && next_col >= 0 && next_col < n as i64 {
                        let next: i64 = next_row * (n as i64) + next_col
                        let index: usize = next as usize
                        if visited⁅index⁆ == false && safeness⁅index⁆ >= limit {
                            visited.set((next + 1) as isize, true)
                            queue.push_back(next)
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

# 先多源 BFS 求出每格到最近小偷的曼哈顿距离（safeness），
# 再对安全值二分，用 BFS 判定是否存在一条每格 safeness 都不低于该值的路径。
[export(case: "camelCase")]
micro maximumSafenessFactor(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let n: usize = grid.length()
    let total: usize = n * n

    let mut safeness: ArrayList<i64> = ArrayList::new(total)
    let mut fill: usize = 0
    while fill < total {
        safeness.push(-1)
        fill = fill + 1
    }

    let mut queue: Deque<i64> = Deque::new()
    let mut row: usize = 0
    while row < n {
        let values: ArrayList<i64> = grid⁅row⁆
        let mut col: usize = 0
        while col < n {
            if values⁅col⁆ == 1 {
                let cell: i64 = row as i64 * (n as i64) + col as i64
                safeness.set((cell + 1) as isize, 0)
                queue.push_back(cell)
            }
            col = col + 1
        }
        row = row + 1
    }

    let has_thief: bool = queue.is_empty() == false
    if has_thief == false {
        return n as i64 - 1
    }

    while queue.is_empty() == false {
        let cell: i64 = queue.pop_front().unwrap()
        let current_row: i64 = cell / (n as i64)
        let current_col: i64 = cell % (n as i64)
        let current: i64 = safeness⁅cell as usize⁆ + 1
        let mut drow: i64 = -1
        while drow <= 1 {
            let mut dcol: i64 = -1
            while dcol <= 1 {
                let orthogonal: bool = (drow == 0 || dcol == 0) && (drow != 0 || dcol != 0)
                if orthogonal {
                    let next_row: i64 = current_row + drow
                    let next_col: i64 = current_col + dcol
                    if next_row >= 0 && next_row < n as i64 && next_col >= 0 && next_col < n as i64 {
                        let next: i64 = next_row * (n as i64) + next_col
                        if safeness⁅next as usize⁆ == -1 {
                            safeness.set((next + 1) as isize, current)
                            queue.push_back(next)
                        }
                    }
                }
                dcol = dcol + 1
            }
            drow = drow + 1
        }
    }

    let mut low: i64 = 0
    let mut high: i64 = n as i64 - 1
    while low < high {
        let middle: i64 = (low + high + 1) / 2
        if reachable(middle, safeness, n) {
            low = middle
        } else {
            high = middle - 1
        }
    }
    return low
}

class Solution {
    micro maximumSafenessFactor(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return maximumSafenessFactor(grid)
    }
}
