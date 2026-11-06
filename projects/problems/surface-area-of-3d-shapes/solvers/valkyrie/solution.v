namespace leetcode.surface_area_of_3d_shapes;

using std.collection;

# 每格贡献上下两面，四周再按与相邻格的高度差补侧面。
[export(case: "camelCase")]
micro surfaceArea(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    let columns: usize = grid⁅0⁆.length()
    let mut area: i64 = 0
    let mut row: usize = 0
    while row < rows {
        let mut column: usize = 0
        while column < columns {
            let height: i64 = grid⁅row⁆⁅column⁆
            if height > 0 {
                area = area + 2

                let mut below: i64 = 0
                if row > 0 {
                    below = grid⁅row - 1⁆⁅column⁆
                }
                if height > below {
                    area = area + height - below
                }

                let mut above: i64 = 0
                if row + 1 < rows {
                    above = grid⁅row + 1⁆⁅column⁆
                }
                if height > above {
                    area = area + height - above
                }

                let mut left: i64 = 0
                if column > 0 {
                    left = grid⁅row⁆⁅column - 1⁆
                }
                if height > left {
                    area = area + height - left
                }

                let mut right: i64 = 0
                if column + 1 < columns {
                    right = grid⁅row⁆⁅column + 1⁆
                }
                if height > right {
                    area = area + height - right
                }
            }
            column = column + 1
        }
        row = row + 1
    }
    return area
}

class Solution {
    micro surfaceArea(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return surfaceArea(grid)
    }
}
