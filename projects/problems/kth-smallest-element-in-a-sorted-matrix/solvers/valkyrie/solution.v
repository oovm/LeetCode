namespace leetcode.kth_smallest_element_in_a_sorted_matrix;

using std.collection;

# 值域二分：每行内取「最后一个 <= mid 的列」，行号递增时该列只会左移，
# 因此一趟双指针即可统计全矩阵 <= mid 的元素个数。
micro count_not_greater(matrix: ArrayList<ArrayList<i64>>, mid: i64, rows: usize, columns: usize) -> i64 {
    let mut total: i64 = 0
    let mut column: i64 = columns as i64 - 1
    let mut row_index: usize = 0
    while row_index < rows {
        let row: ArrayList<i64> = matrix⁅row_index⁆
        while column >= 0 && row⁅column as usize⁆ > mid {
            column = column - 1
        }
        total = total + column + 1
        row_index = row_index + 1
    }
    return total
}

[export(case: "camelCase")]
micro kthSmallest(matrix: ArrayList<ArrayList<i64>>, k: i64) -> i64 {
    let rows: usize = matrix.length()
    let first_row: ArrayList<i64> = matrix⁅0⁆
    let last_row: ArrayList<i64> = matrix⁅rows - 1⁆
    let columns: usize = first_row.length()

    let mut low: i64 = first_row⁅0⁆
    let mut high: i64 = last_row⁅columns - 1⁆
    while low < high {
        let mid: i64 = low + (high - low) / 2
        if count_not_greater(matrix, mid, rows, columns) >= k {
            high = mid
        } else {
            low = mid + 1
        }
    }
    return low
}

class Solution {
    micro kthSmallest(self, matrix: ArrayList<ArrayList<i64>>, k: i64): i64 {
        return kthSmallest(matrix, k)
    }
}
