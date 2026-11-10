namespace leetcode.the_maze;

using std.collection;

# 四方向滑动 DFS：沿一个方向滑到撞墙才停；落点即终点则成功，否则递归未访问落点。
micro roll(maze: ArrayList<ArrayList<i64>>, seen: ArrayList<ArrayList<i64>>, rows: usize, cols: usize, i: usize, j: usize, ti: usize, tj: usize) -> bool {
    seen⁅i⁆⁅j⁆ = 1
    let mut x: usize = i
    let mut y: usize = j
    while x > 0 && maze⁅x - 1⁆⁅y⁆ == 0 {
        x = x - 1
    }
    if x == ti && y == tj {
        return true
    }
    if seen⁅x⁆⁅y⁆ == 0 && roll(maze, seen, rows, cols, x, y, ti, tj) {
        return true
    }
    x = i
    y = j
    while x + 1 < rows && maze⁅x + 1⁆⁅y⁆ == 0 {
        x = x + 1
    }
    if x == ti && y == tj {
        return true
    }
    if seen⁅x⁆⁅y⁆ == 0 && roll(maze, seen, rows, cols, x, y, ti, tj) {
        return true
    }
    x = i
    y = j
    while y > 0 && maze⁅x⁆⁅y - 1⁆ == 0 {
        y = y - 1
    }
    if x == ti && y == tj {
        return true
    }
    if seen⁅x⁆⁅y⁆ == 0 && roll(maze, seen, rows, cols, x, y, ti, tj) {
        return true
    }
    x = i
    y = j
    while y + 1 < cols && maze⁅x⁆⁅y + 1⁆ == 0 {
        y = y + 1
    }
    if x == ti && y == tj {
        return true
    }
    if seen⁅x⁆⁅y⁆ == 0 && roll(maze, seen, rows, cols, x, y, ti, tj) {
        return true
    }
    return false
}

[export(case: "camelCase")]
micro hasPath(maze: ArrayList<ArrayList<i64>>, start: ArrayList<i64>, destination: ArrayList<i64>) -> bool {
    let rows: usize = maze.length()
    let cols: usize = maze⁅0⁆.length()
    let si: usize = start⁅0⁆ as usize
    let sj: usize = start⁅1⁆ as usize
    let ti: usize = destination⁅0⁆ as usize
    let tj: usize = destination⁅1⁆ as usize
    if si == ti && sj == tj {
        return true
    }
    let mut seen: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut i: usize = 0
    while i < rows {
        let mut row: ArrayList<i64> = ArrayList::new(cols)
        let mut j: usize = 0
        while j < cols {
            row.push(0)
            j = j + 1
        }
        seen.push(row)
        i = i + 1
    }
    return roll(maze, seen, rows, cols, si, sj, ti, tj)
}

class Solution {
    micro hasPath(self, maze: ArrayList<ArrayList<i64>>, start: ArrayList<i64>, destination: ArrayList<i64>): bool {
        return hasPath(maze, start, destination)
    }
}
