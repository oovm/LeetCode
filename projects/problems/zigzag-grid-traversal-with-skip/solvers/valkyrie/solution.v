namespace leetcode.zigzag_grid_traversal_with_skip;

using std.collection;

# 偶数行从左到右、奇数行从右到左，再按全局遍历序号的奇偶隔项取值。
[export(case: "camelCase")]
micro zigzagTraversal(grid: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let rows: usize = grid.length()
    let columns: usize = grid⁅0⁆.length()
    let mut answer: ArrayList<i64> = ArrayList::new(rows * columns)
    let mut row: usize = 0
    while row < rows {
        let mut position: usize = 0
        while position < columns {
            if (row * columns + position) % 2 == 0 {
                let mut source_column: usize = position
                if row % 2 == 1 {
                    source_column = columns - 1 - position
                }
                answer.push(grid⁅row⁆⁅source_column⁆)
            }
            position = position + 1
        }
        row = row + 1
    }
    return answer
}

class Solution {
    micro zigzagTraversal(self, grid: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return zigzagTraversal(grid)
    }
}
