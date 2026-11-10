namespace leetcode.search_a_2d_matrix_ii;

using std.collection;

# 右上角阶梯搜索：比 target 大左移，比 target 小下移；每步消一列或一行，O(m+n)。
[export(case: "camelCase")]
micro searchMatrix(matrix: ArrayList<ArrayList<i64>>, target: i64) -> bool {
    let rows: usize = matrix.length()
    if rows == 0 || matrix⁅0⁆.length() == 0 {
        return false
    }
    let mut i: usize = 0
    let mut j: usize = matrix⁅0⁆.length() - 1
    while i < rows {
        let value: i64 = matrix⁅i⁆⁅j⁆
        if value == target {
            return true
        }
        if value > target {
            if j == 0 {
                return false
            }
            j = j - 1
        } else {
            i = i + 1
        }
    }
    return false
}

class Solution {
    micro searchMatrix(self, matrix: ArrayList<ArrayList<i64>>, target: i64): bool {
        return searchMatrix(matrix, target)
    }
}
