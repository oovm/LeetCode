namespace leetcode.search_a_2d_matrix;

using std.collection;

# 展平二分：整体升序，mid 下标还原为 (mid / cols, mid % cols)。O(log mn)。
[export(case: "camelCase")]
micro searchMatrix(matrix: ArrayList<ArrayList<i64>>, target: i64) -> bool {
    let rows: usize = matrix.length()
    if rows == 0 || matrix⁅0⁆.length() == 0 {
        return false
    }
    let cols: usize = matrix⁅0⁆.length()
    let mut lo: i64 = 0
    let mut hi: i64 = rows as i64 * cols as i64 - 1
    while lo <= hi {
        let mid: i64 = (lo + hi) / 2
        let value: i64 = matrix⁅(mid / cols as i64) as usize⁆⁅(mid % cols as i64) as usize⁆
        if value == target {
            return true
        }
        if value < target {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return false
}

class Solution {
    micro searchMatrix(self, matrix: ArrayList<ArrayList<i64>>, target: i64): bool {
        return searchMatrix(matrix, target)
    }
}
