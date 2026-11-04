namespace leetcode.reshape_the_matrix;

# 元素总数一致才重塑；用线性下标 `i * cols + j` 在原矩阵上换算行列，一次遍历完成。
[export(case: "camelCase")]
micro matrixReshape(mat: ArrayList<ArrayList<i64>>, r: i64, c: i64) -> ArrayList<ArrayList<i64>> {
    let rows: usize = mat.length()
    if rows == 0 {
        return mat
    }
    let cols: usize = mat⁅0⁆.length()
    let total: i64 = (rows * cols) as i64
    if total != r * c {
        return mat
    }
    let out_rows: usize = r as usize
    let out_cols: usize = c as usize
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(out_rows)
    let mut i: usize = 0
    while i < out_rows {
        let mut row: ArrayList<i64> = ArrayList::new(out_cols)
        let mut j: usize = 0
        while j < out_cols {
            let flat: usize = i * out_cols + j
            let source_row: usize = flat / cols
            let source_col: usize = flat % cols
            row.push(mat⁅source_row⁆⁅source_col⁆)
            j = j + 1
        }
        result.push(row)
        i = i + 1
    }
    return result
}

class Solution {
    micro matrixReshape(self, mat: ArrayList<ArrayList<i64>>, r: i64, c: i64): ArrayList<ArrayList<i64>> {
        return matrixReshape(mat, r, c)
    }
}
