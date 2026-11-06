namespace leetcode.count_square_submatrices_with_all_ones;

using std.collection;

# 经典正方形计数：以每个格子为右下角的最大全 1 正方形边长取上、左、左上三者最小值加一。
[export(case: "camelCase")]
micro countSquares(matrix: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = matrix.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = matrix⁅0⁆.length()

    let mut widths: ArrayList<i64> = ArrayList::new(cols)
    let mut col_index: usize = 0
    while col_index < cols {
        widths.push(0)
        col_index = col_index + 1
    }

    let mut answer: i64 = 0
    let mut row_index: usize = 0
    while row_index < rows {
        let row: ArrayList<i64> = matrix⁅row_index⁆
        let mut diagonal: i64 = 0
        col_index = 0
        while col_index < cols {
            let above: i64 = widths⁅col_index⁆
            let mut left: i64 = 0
            if col_index > 0 {
                left = widths⁅col_index - 1⁆
            }
            let mut side: i64 = 0
            if row⁅col_index⁆ == 1 {
                side = above
                if left < side {
                    side = left
                }
                if diagonal < side {
                    side = diagonal
                }
                side = side + 1
                answer = answer + side
            }
            widths⁅col_index⁆ = side
            diagonal = above
            col_index = col_index + 1
        }
        row_index = row_index + 1
    }
    return answer
}

class Solution {
    micro countSquares(self, matrix: ArrayList<ArrayList<i64>>): i64 {
        return countSquares(matrix)
    }
}
