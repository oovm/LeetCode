namespace leetcode.the_maze_ii;

using std.collection;

# 停点图 Dijkstra：每格沿四向滑到撞墙为一个停点，边权 = 滑动步数；O((mn)²) 扫描选最小。
[export(case: "camelCase")]
micro shortestDistance(maze: ArrayList<ArrayList<i64>>, start: ArrayList<i64>, destination: ArrayList<i64>) -> i64 {
    let rows: usize = maze.length()
    let cols: usize = maze⁅0⁆.length()
    let inf: i64 = (1 as i64).bit_shift_left(60)
    let mut dist: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut visited: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut i: usize = 0
    while i < rows {
        let mut row: ArrayList<i64> = ArrayList::new(cols)
        let mut mark: ArrayList<i64> = ArrayList::new(cols)
        let mut j: usize = 0
        while j < cols {
            row.push(inf)
            mark.push(0)
            j = j + 1
        }
        dist.push(row)
        visited.push(mark)
        i = i + 1
    }
    dist⁅start⁅0⁆ as usize⁆⁅start⁅1⁆ as usize⁆ = 0
    let di: usize = destination⁅0⁆ as usize
    let dj: usize = destination⁅1⁆ as usize
    let mut done: bool = false
    while !done {
        let mut best_r: usize = 0
        let mut best_c: usize = 0
        let mut best: i64 = inf
        let mut found: bool = false
        i = 0
        while i < rows {
            let mut j: usize = 0
            while j < cols {
                if visited⁅i⁆⁅j⁆ == 0 && dist⁅i⁆⁅j⁆ < best {
                    best = dist⁅i⁆⁅j⁆
                    best_r = i
                    best_c = j
                    found = true
                }
                j = j + 1
            }
            i = i + 1
        }
        if !found {
            done = true
        } else {
            if best_r == di && best_c == dj {
                return best
            }
            visited⁅best_r⁆⁅best_c⁆ = 1
            let mut r: usize = best_r
            let mut c: usize = best_c
            let mut steps: i64 = 0
            while r > 0 && maze⁅r - 1⁆⁅c⁆ == 0 {
                r = r - 1
                steps = steps + 1
            }
            if steps > 0 && dist⁅best_r⁆⁅best_c⁆ + steps < dist⁅r⁆⁅c⁆ {
                dist⁅r⁆⁅c⁆ = dist⁅best_r⁆⁅best_c⁆ + steps
            }
            r = best_r
            c = best_c
            steps = 0
            while r + 1 < rows && maze⁅r + 1⁆⁅c⁆ == 0 {
                r = r + 1
                steps = steps + 1
            }
            if steps > 0 && dist⁅best_r⁆⁅best_c⁆ + steps < dist⁅r⁆⁅c⁆ {
                dist⁅r⁆⁅c⁆ = dist⁅best_r⁆⁅best_c⁆ + steps
            }
            r = best_r
            c = best_c
            steps = 0
            while c > 0 && maze⁅r⁆⁅c - 1⁆ == 0 {
                c = c - 1
                steps = steps + 1
            }
            if steps > 0 && dist⁅best_r⁆⁅best_c⁆ + steps < dist⁅r⁆⁅c⁆ {
                dist⁅r⁆⁅c⁆ = dist⁅best_r⁆⁅best_c⁆ + steps
            }
            r = best_r
            c = best_c
            steps = 0
            while c + 1 < cols && maze⁅r⁆⁅c + 1⁆ == 0 {
                c = c + 1
                steps = steps + 1
            }
            if steps > 0 && dist⁅best_r⁆⁅best_c⁆ + steps < dist⁅r⁆⁅c⁆ {
                dist⁅r⁆⁅c⁆ = dist⁅best_r⁆⁅best_c⁆ + steps
            }
        }
    }
    if dist⁅di⁆⁅dj⁆ == inf {
        return -1
    }
    return dist⁅di⁆⁅dj⁆
}

class Solution {
    micro shortestDistance(self, maze: ArrayList<ArrayList<i64>>, start: ArrayList<i64>, destination: ArrayList<i64>): i64 {
        return shortestDistance(maze, start, destination)
    }
}
