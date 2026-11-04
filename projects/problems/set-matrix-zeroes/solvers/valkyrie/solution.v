namespace leetcode.set_matrix_zeroes;

# 首行 / 首列当标记位：O(m·n) 时间 / O(1) 额外空间。
# 嵌套载体写侧：行取出后逐格写穿；首行首列自身是否含 0 另存两个布尔。
[export(case: "camelCase")]
micro set_zeroes(mut matrix: ArrayList<ArrayList<i64>>) -> unit {
    let rows: usize = matrix.length()
    if rows == 0 {
        return
    }
    let cols: usize = matrix⁅0⁆.length()
    if cols == 0 {
        return
    }

    let mut first_row_zero: bool = false
    let mut first_col_zero: bool = false
    let mut j: usize = 0
    while j < cols {
        if matrix⁅0⁆⁅j⁆ == 0 {
            first_row_zero = true
        }
        j = j + 1
    }
    let mut i: usize = 0
    while i < rows {
        if matrix⁅i⁆⁅0⁆ == 0 {
            first_col_zero = true
        }
        i = i + 1
    }

    i = 1
    while i < rows {
        let mut c: usize = 1
        while c < cols {
            if matrix⁅i⁆⁅c⁆ == 0 {
                matrix⁅i⁆⁅0⁆ = 0
                matrix⁅0⁆⁅c⁆ = 0
            }
            c = c + 1
        }
        i = i + 1
    }

    i = 1
    while i < rows {
        let mut c: usize = 1
        while c < cols {
            if matrix⁅i⁆⁅0⁆ == 0 || matrix⁅0⁆⁅c⁆ == 0 {
                matrix⁅i⁆⁅c⁆ = 0
            }
            c = c + 1
        }
        i = i + 1
    }

    if first_row_zero {
        let mut c: usize = 0
        while c < cols {
            matrix⁅0⁆⁅c⁆ = 0
            c = c + 1
        }
    }
    if first_col_zero {
        let mut r: usize = 0
        while r < rows {
            matrix⁅r⁆⁅0⁆ = 0
            r = r + 1
        }
    }
}

class Solution {
    micro setZeroes(mut self, matrix: ArrayList<ArrayList<i64>>): unit {
        set_zeroes(matrix)
    }
}
