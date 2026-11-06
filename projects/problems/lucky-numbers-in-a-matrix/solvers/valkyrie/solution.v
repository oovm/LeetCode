namespace leetcode.lucky_numbers_in_a_matrix;

using std.collection;

# 先取每行最小值与每列最大值，再收集同时满足两者的格子。
[export(case: "camelCase")]
micro luckyNumbers(matrix: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let rows: usize = matrix.length()
    let columns: usize = matrix⁅0⁆.length()
    let mut row_minimum: ArrayList<i64> = ArrayList::new(rows)
    let mut row: usize = 0
    while row < rows {
        let mut current: i64 = matrix⁅row⁆⁅0⁆
        let mut column: usize = 1
        while column < columns {
            if matrix⁅row⁆⁅column⁆ < current {
                current = matrix⁅row⁆⁅column⁆
            }
            column = column + 1
        }
        row_minimum.push(current)
        row = row + 1
    }
    let mut column_maximum: ArrayList<i64> = ArrayList::new(columns)
    let mut column: usize = 0
    while column < columns {
        let mut current: i64 = matrix⁅0⁆⁅column⁆
        let mut row_scan: usize = 1
        while row_scan < rows {
            if matrix⁅row_scan⁆⁅column⁆ > current {
                current = matrix⁅row_scan⁆⁅column⁆
            }
            row_scan = row_scan + 1
        }
        column_maximum.push(current)
        column = column + 1
    }
    let mut answer: ArrayList<i64> = ArrayList::new(rows)
    row = 0
    while row < rows {
        column = 0
        while column < columns {
            if matrix⁅row⁆⁅column⁆ == row_minimum⁅row⁆ {
                if matrix⁅row⁆⁅column⁆ == column_maximum⁅column⁆ {
                    answer.push(matrix⁅row⁆⁅column⁆)
                }
            }
            column = column + 1
        }
        row = row + 1
    }
    return answer
}

class Solution {
    micro luckyNumbers(self, matrix: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return luckyNumbers(matrix)
    }
}
