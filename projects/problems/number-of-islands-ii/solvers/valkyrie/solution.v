namespace leetcode.solution

using std.collection

# 题内触发点: G10 —— `DisjointSet` 以「集合元素」为键，题内把二维坐标压成单 i64 后直接建森林，
# 只依赖 `new` / `add` / `contains` / `union` / `group_count`，不依赖索引式并查集构造。
class Solution {
    [export(case: "camelCase")]
    micro numIslands2(m: i64, n: i64, positions: [[i64]]) -> [i64] {
        let cols: i64 = n
        let mut islands: DisjointSet<i64> = DisjointSet::new()
        let mut answers: ArrayList<i64> = ArrayList::new(positions.length())
        loop position in positions {
            let row: i64 = position⁅0⁆
            let column: i64 = position⁅1⁆
            let cell: i64 = row * cols + column
            if !islands.contains(cell) {
                islands.add(cell)
                if row > 0 {
                    let above: i64 = cell - cols
                    if islands.contains(above) {
                        islands.union(cell, above)
                    }
                }
                if row + 1 < m {
                    let below: i64 = cell + cols
                    if islands.contains(below) {
                        islands.union(cell, below)
                    }
                }
                if column > 0 {
                    let left: i64 = cell - 1
                    if islands.contains(left) {
                        islands.union(cell, left)
                    }
                }
                if column + 1 < cols {
                    let right: i64 = cell + 1
                    if islands.contains(right) {
                        islands.union(cell, right)
                    }
                }
            }
            answers.push(islands.group_count() as i64)
        }
        return answers.to_array()
    }
}
