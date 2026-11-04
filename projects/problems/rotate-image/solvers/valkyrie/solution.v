namespace leetcode.rotate_image;

# 顺时针 90°：先沿主对角线转置，再逐行左右反转。O(n²) 时间 / O(1) 额外空间。
# 嵌套载体写侧：行是引用类型 `ArrayList<i64>`，取出后逐格写穿即回落到原矩阵。
micro swap_cells(mut matrix: ArrayList<ArrayList<i64>>, r1: usize, c1: usize, r2: usize, c2: usize): unit {
    let tmp: i64 = matrix⁅r1⁆⁅c1⁆
    matrix⁅r1⁆⁅c1⁆ = matrix⁅r2⁆⁅c2⁆
    matrix⁅r2⁆⁅c2⁆ = tmp
}

[export(case: "camelCase")]
micro rotate(mut matrix: ArrayList<ArrayList<i64>>) -> unit {
    let n: usize = matrix.length()

    let mut row: usize = 0
    while row < n {
        let mut col: usize = row + 1
        while col < n {
            swap_cells(matrix, row, col, col, row)
            col = col + 1
        }
        row = row + 1
    }

    # G21：`ArrayList` 没有原地 `reverse`，`Iterator` 也没有 `rev`，
    # 行内反转只能手写双指针交换（与 `squares-of-a-sorted-array`、`add-binary` 同病）。
    let mut r: usize = 0
    while r < n {
        let line: ArrayList<i64> = matrix⁅r⁆
        let mut left: usize = 0
        let mut right: usize = n - 1
        while left < right {
            let tmp: i64 = line⁅left⁆
            line⁅left⁆ = line⁅right⁆
            line⁅right⁆ = tmp
            left = left + 1
            right = right - 1
        }
        r = r + 1
    }
}

class Solution {
    micro rotate(mut self, matrix: ArrayList<ArrayList<i64>>): unit {
        rotate(matrix)
    }
}
