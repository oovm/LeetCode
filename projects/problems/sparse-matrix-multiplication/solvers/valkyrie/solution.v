namespace leetcode.sparse_matrix_multiplication;

using std.collection;

# 稀疏乘法：外层逐 mat1 非零元素，仅对 mat2 同行非零列累加；跳过全零行/列。
[export(case: "camelCase")]
micro multiply(mat1: ArrayList<ArrayList<i64>>, mat2: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = mat1.length()
    let inner: usize = mat1⁅0⁆.length()
    let cols: usize = mat2⁅0⁆.length()
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut i: usize = 0
    while i < rows {
        let mut row: ArrayList<i64> = ArrayList::new(cols)
        let mut j: usize = 0
        while j < cols {
            row.push(0)
            j = j + 1
        }
        out.push(row)
        i = i + 1
    }
    i = 0
    while i < rows {
        let mut k: usize = 0
        while k < inner {
            let left: i64 = mat1⁅i⁆⁅k⁆
            if left != 0 {
                let mut j: usize = 0
                while j < cols {
                    let right: i64 = mat2⁅k⁆⁅j⁆
                    if right != 0 {
                        out⁅i⁆⁅j⁆ = out⁅i⁆⁅j⁆ + left * right
                    }
                    j = j + 1
                }
            }
            k = k + 1
        }
        i = i + 1
    }
    return out
}

class Solution {
    micro multiply(self, mat1: ArrayList<ArrayList<i64>>, mat2: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return multiply(mat1, mat2)
    }
}
