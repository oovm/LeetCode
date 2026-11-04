namespace leetcode.rotting_oranges;

using std.collection;

# 多源 BFS：所有腐烂橘子同时入队，按层推进；最后仍有新鲜橘子则返回 -1。
# 用一维 `ArrayList<bool>` 记录已腐烂位置，不改写输入的 grid。
[export(case: "camelCase")]
micro orangesRotting(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = grid⁅0⁆.length()
    if cols == 0 {
        return 0
    }

    let mut fresh: i64 = 0
    let mut rotten: ArrayList<bool> = ArrayList::new(rows * cols)
    let mut queue: Deque<i64> = Deque::new()

    let mut row: usize = 0
    while row < rows {
        let values: ArrayList<i64> = grid⁅row⁆
        let mut col: usize = 0
        while col < cols {
            let index: usize = row * cols + col
            rotten.push(false)
            if values⁅col⁆ == 1 {
                fresh = fresh + 1
            }
            if values⁅col⁆ == 2 {
                rotten.set((index + 1) as isize, true)
                queue.push_back(index as i64)
            }
            col = col + 1
        }
        row = row + 1
    }

    if fresh == 0 {
        return 0
    }

    let mut minutes: i64 = 0
    while queue.is_empty() == false {
        let level: usize = queue.length()
        let mut processed: usize = 0
        while processed < level {
            let cell: i64 = queue.pop_front().unwrap()
            let current_row: usize = cell as usize / cols
            let current_col: usize = cell as usize % cols

            if current_row > 0 {
                let target: usize = (current_row - 1) * cols + current_col
                let values: ArrayList<i64> = grid⁅current_row - 1⁆
                if values⁅current_col⁆ == 1 && rotten⁅target⁆ == false {
                    rotten.set((target + 1) as isize, true)
                    fresh = fresh - 1
                    queue.push_back(target as i64)
                }
            }
            if current_row + 1 < rows {
                let target: usize = (current_row + 1) * cols + current_col
                let values: ArrayList<i64> = grid⁅current_row + 1⁆
                if values⁅current_col⁆ == 1 && rotten⁅target⁆ == false {
                    rotten.set((target + 1) as isize, true)
                    fresh = fresh - 1
                    queue.push_back(target as i64)
                }
            }
            if current_col > 0 {
                let target: usize = current_row * cols + current_col - 1
                let values: ArrayList<i64> = grid⁅current_row⁆
                if values⁅current_col - 1⁆ == 1 && rotten⁅target⁆ == false {
                    rotten.set((target + 1) as isize, true)
                    fresh = fresh - 1
                    queue.push_back(target as i64)
                }
            }
            if current_col + 1 < cols {
                let target: usize = current_row * cols + current_col + 1
                let values: ArrayList<i64> = grid⁅current_row⁆
                if values⁅current_col + 1⁆ == 1 && rotten⁅target⁆ == false {
                    rotten.set((target + 1) as isize, true)
                    fresh = fresh - 1
                    queue.push_back(target as i64)
                }
            }
            processed = processed + 1
        }
        minutes = minutes + 1
    }

    if fresh > 0 {
        return -1
    }
    return minutes - 1
}

class Solution {
    micro orangesRotting(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return orangesRotting(grid)
    }
}
