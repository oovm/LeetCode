namespace leetcode.number_of_islands;

using std.collection;

# 洪泛 DFS：命中 "1" 计数并把整座岛沉为 "0"，四邻上下左右；每格至多入队一次，O(mn)。
micro sink(grid: ArrayList<ArrayList<utf8>>, rows: usize, cols: usize, i: usize, j: usize) -> unit {
    grid⁅i⁆⁅j⁆ = "0"
    if i > 0 && grid⁅i - 1⁆⁅j⁆ == "1" {
        sink(grid, rows, cols, i - 1, j)
    }
    if i + 1 < rows && grid⁅i + 1⁆⁅j⁆ == "1" {
        sink(grid, rows, cols, i + 1, j)
    }
    if j > 0 && grid⁅i⁆⁅j - 1⁆ == "1" {
        sink(grid, rows, cols, i, j - 1)
    }
    if j + 1 < cols && grid⁅i⁆⁅j + 1⁆ == "1" {
        sink(grid, rows, cols, i, j + 1)
    }
}

[export(case: "camelCase")]
micro numIslands(grid: ArrayList<ArrayList<utf8>>) -> i64 {
    let rows: usize = grid.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = grid⁅0⁆.length()
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < rows {
        let mut j: usize = 0
        while j < cols {
            if grid⁅i⁆⁅j⁆ == "1" {
                count = count + 1
                sink(grid, rows, cols, i, j)
            }
            j = j + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro numIslands(self, grid: ArrayList<ArrayList<utf8>>): i64 {
        return numIslands(grid)
    }
}
