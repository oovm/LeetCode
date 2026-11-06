namespace leetcode.projection_area_of_3d_shapes;

using std.collection;

# 俯视图数非零格，主视图每行最大值，侧视图每列最大值。
[export(case: "camelCase")]
micro projectionArea(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let size: usize = grid.length()
    let mut area: i64 = 0
    let mut row: usize = 0
    while row < size {
        let mut row_maximum: i64 = 0
        let mut column_maximum: i64 = 0
        let mut column: usize = 0
        while column < size {
            let row_value: i64 = grid⁅row⁆⁅column⁆
            if row_value > 0 {
                area = area + 1
            }
            if row_value > row_maximum {
                row_maximum = row_value
            }
            let column_value: i64 = grid⁅column⁆⁅row⁆
            if column_value > column_maximum {
                column_maximum = column_value
            }
            column = column + 1
        }
        area = area + row_maximum + column_maximum
        row = row + 1
    }
    return area
}

class Solution {
    micro projectionArea(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return projectionArea(grid)
    }
}
