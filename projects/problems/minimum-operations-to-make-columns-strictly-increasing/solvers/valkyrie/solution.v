namespace leetcode.minimum_operations_to_make_columns_strictly_increasing;

using std.collection;

# 逐列自上而下抬升，每个数至少要比上一行大 1。
[export(case: "camelCase")]
micro minimumOperations(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    let columns: usize = grid⁅0⁆.length()
    let mut working: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row: usize = 0
    while row < rows {
        let source: ArrayList<i64> = grid⁅row⁆
        let mut copied: ArrayList<i64> = ArrayList::new(columns)
        let mut column: usize = 0
        while column < columns {
            copied.push(source⁅column⁆)
            column = column + 1
        }
        working.push(copied)
        row = row + 1
    }

    let mut operations: i64 = 0
    let mut column: usize = 0
    while column < columns {
        let mut row: usize = 1
        while row < rows {
            let previous: i64 = working⁅row - 1⁆⁅column⁆
            let current: i64 = working⁅row⁆⁅column⁆
            if current <= previous {
                operations = operations + previous + 1 - current
                working⁅row⁆⁅column⁆ = previous + 1
            }
            row = row + 1
        }
        column = column + 1
    }
    return operations
}

class Solution {
    micro minimumOperations(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return minimumOperations(grid)
    }
}
