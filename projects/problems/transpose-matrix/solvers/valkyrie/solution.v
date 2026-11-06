namespace leetcode.transpose_matrix;

using std.collection;

# 输出形状为原矩阵的列数 × 行数，逐元素搬到转置位置。
[export(case: "camelCase")]
micro transpose(matrix: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = matrix.length()
    let columns: usize = matrix⁅0⁆.length()

    let mut answer: ArrayList<ArrayList<i64>> = ArrayList::new(columns)
    let mut column: usize = 0
    while column < columns {
        let mut values: ArrayList<i64> = ArrayList::new(rows)
        let mut fill: usize = 0
        while fill < rows {
            values.push(0)
            fill = fill + 1
        }
        answer.push(values)
        column = column + 1
    }

    let mut row: usize = 0
    while row < rows {
        column = 0
        while column < columns {
            answer⁅column⁆⁅row⁆ = matrix⁅row⁆⁅column⁆
            column = column + 1
        }
        row = row + 1
    }
    return answer
}

class Solution {
    micro transpose(self, matrix: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return transpose(matrix)
    }
}
