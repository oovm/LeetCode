namespace leetcode.matrix_diagonal_sum

# 主对角线与副对角线各取一次，奇数阶中心格子被两条对角线重复，需减一次。
[export(case: "camelCase")]
micro diagonalSum(mat: ArrayList<ArrayList<i64>>) -> i64 {
    let n: usize = mat.length()
    let mut total: i64 = 0
    let mut i: usize = 0
    while i < n {
        let row: ArrayList<i64> = mat⁅i⁆
        let mirror: usize = n - 1 - i
        total = total + row⁅i⁆ + row⁅mirror⁆
        i = i + 1
    }
    if n % 2 == 1 {
        let middle: usize = n / 2
        let center: ArrayList<i64> = mat⁅middle⁆
        total = total - center⁅middle⁆
    }
    return total
}

class Solution {
    micro diagonalSum(self, mat: ArrayList<ArrayList<i64>>): i64 {
        return diagonalSum(mat)
    }
}
