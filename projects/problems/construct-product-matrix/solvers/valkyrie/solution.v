namespace leetcode.construct_product_matrix;

using std.collection;

# 把矩阵摊平后做后缀积，再用前缀积逐位相乘；全程对 12345 取模，零元素自然传播为零。
[export(case: "camelCase")]
micro constructProductMatrix(grid: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = grid.length()
    let mut cols: usize = 0
    if rows > 0 {
        cols = grid⁅0⁆.length()
    }
    let modulus: i64 = 12345

    let mut values: ArrayList<i64> = ArrayList::new(rows * cols)
    loop row in grid {
        loop value in row {
            values.push(value)
        }
    }
    let total: usize = values.length()

    let mut suffix: ArrayList<i64> = ArrayList::new(total + 1)
    let mut index: usize = 0
    while index <= total {
        suffix.push(1)
        index = index + 1
    }
    index = total
    while index > 0 {
        index = index - 1
        suffix⁅index⁆ = suffix⁅index + 1⁆ * values⁅index⁆ % modulus
    }

    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut prefix: i64 = 1
    index = 0
    let mut row_index: usize = 0
    while row_index < rows {
        let mut row: ArrayList<i64> = ArrayList::new(cols)
        let mut col_index: usize = 0
        while col_index < cols {
            let product: i64 = suffix⁅index + 1⁆ * prefix % modulus
            row.push(product)
            prefix = prefix * values⁅index⁆ % modulus
            index = index + 1
            col_index = col_index + 1
        }
        result.push(row)
        row_index = row_index + 1
    }
    return result
}

class Solution {
    micro constructProductMatrix(self, grid: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return constructProductMatrix(grid)
    }
}
