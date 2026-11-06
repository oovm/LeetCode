namespace leetcode.modify_the_matrix;

using std.collection;

# 逐列求最大值，再把该列的 -1 全部替换成这个最大值。
[export(case: "camelCase")]
micro modifiedMatrix(matrix: ArrayList<ArrayList<i64>>) -> ArrayList<ArrayList<i64>> {
    let rows: usize = matrix.length()
    let columns: usize = matrix⁅0⁆.length()
    let mut working: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row: usize = 0
    while row < rows {
        let source: ArrayList<i64> = matrix⁅row⁆
        let mut copied: ArrayList<i64> = ArrayList::new(columns)
        let mut column: usize = 0
        while column < columns {
            copied.push(source⁅column⁆)
            column = column + 1
        }
        working.push(copied)
        row = row + 1
    }

    let mut column: usize = 0
    while column < columns {
        let mut best: i64 = -1
        let mut row: usize = 0
        while row < rows {
            let value: i64 = working⁅row⁆⁅column⁆
            if value > best {
                best = value
            }
            row = row + 1
        }
        row = 0
        while row < rows {
            if working⁅row⁆⁅column⁆ == -1 {
                working⁅row⁆⁅column⁆ = best
            }
            row = row + 1
        }
        column = column + 1
    }
    return working
}

class Solution {
    micro modifiedMatrix(self, matrix: ArrayList<ArrayList<i64>>): ArrayList<ArrayList<i64>> {
        return modifiedMatrix(matrix)
    }
}
