namespace leetcode.matrix_similarity_after_cyclic_shifts;

using std.collection;

# 偶数行循环右移 k 位、奇数行循环左移 k 位后，整行应与原行相同。
[export(case: "camelCase")]
micro areSimilar(mat: ArrayList<ArrayList<i64>>, k: i64) -> bool {
    let columns: i64 = mat⁅0⁆.length() as i64
    let mut row: usize = 0
    while row < mat.length() {
        let mut column: usize = 0
        while column < mat⁅row⁆.length() {
            let value: i64 = mat⁅row⁆⁅column⁆
            let mut source: i64 = 0
            if row % 2 == 0 {
                source = ((column as i64 - k) % columns + columns) % columns
            } else {
                source = (column as i64 + k) % columns
            }
            if value != mat⁅row⁆⁅source as usize⁆ {
                return false
            }
            column = column + 1
        }
        row = row + 1
    }
    return true
}

class Solution {
    micro areSimilar(self, mat: ArrayList<ArrayList<i64>>, k: i64): bool {
        return areSimilar(mat, k)
    }
}
