namespace leetcode.regions_cut_by_slashes;

using std.collection;
using std.text;

# 每格拆成 4 个小块（左上 0 / 右上 1 / 左下 2 / 右下 3），
# 先按字符把格内小块连起来，再跨格连接相邻小块，最后并查集分量数就是区域数。
[export(case: "camelCase")]
micro regionsBySlashes(grid: [utf8]) -> i64 {
    let count: usize = grid.length()
    if count == 0 {
        return 0
    }
    let total: usize = count * count * 4
    let nvalue: i64 = count as i64

    let mut dsu: DisjointSet<i64> = DisjointSet::new()
    let mut fill: usize = 0
    while fill < total {
        dsu.add(fill as i64)
        fill = fill + 1
    }

    let mut row: usize = 0
    while row < count {
        let text: utf8 = grid⁅row⁆
        let mut col: usize = 0
        while col < text.length() {
            let cell: i64 = (row * count + col) as i64
            let base: i64 = cell * 4

            if row + 1 < count {
                dsu.union(base + 2, (cell + nvalue) * 4)
            }
            if col + 1 < count {
                dsu.union(base + 1, (cell + 1) * 4 + 3)
            }

            let mark: char = text⁅col⁆
            if mark == '/' {
                dsu.union(base, base + 3)
                dsu.union(base + 1, base + 2)
            } else if mark == '\\' {
                dsu.union(base, base + 1)
                dsu.union(base + 2, base + 3)
            } else {
                dsu.union(base, base + 1)
                dsu.union(base + 1, base + 2)
                dsu.union(base + 2, base + 3)
            }
            col = col + 1
        }
        row = row + 1
    }

    return dsu.group_count() as i64
}

class Solution {
    micro regionsBySlashes(self, grid: [utf8]): i64 {
        return regionsBySlashes(grid)
    }
}
