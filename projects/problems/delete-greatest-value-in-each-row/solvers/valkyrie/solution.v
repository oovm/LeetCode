namespace leetcode.delete_greatest_value_in_each_row;

using std.collection;

micro compare_descending(a: i64, b: i64) -> i32 {
    if a > b {
        return -1
    }
    if a < b {
        return 1
    }
    return 0
}

# 每行降序排列后，每一轮删掉的最大值就是同列的最大值，按列求和。
[export(case: "camelCase")]
micro deleteGreatestValue(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    let columns: usize = grid⁅0⁆.length()
    let mut ordered: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row: usize = 0
    while row < rows {
        let sorted_row: ArrayList<i64> = sorted_by(grid⁅row⁆, compare_descending)
        ordered.push(sorted_row)
        row = row + 1
    }

    let mut total: i64 = 0
    let mut column: usize = 0
    while column < columns {
        let mut best: i64 = 0
        row = 0
        while row < rows {
            let value: i64 = ordered⁅row⁆⁅column⁆
            if value > best {
                best = value
            }
            row = row + 1
        }
        total = total + best
        column = column + 1
    }
    return total
}

class Solution {
    micro deleteGreatestValue(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return deleteGreatestValue(grid)
    }
}
