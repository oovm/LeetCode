namespace leetcode.pascals_triangle_ii;

# 第 rowIndex 行即 C(rowIndex, c) 序列。
[export(case: "camelCase")]
micro get_row(rowIndex: i64) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new((rowIndex + 1) as usize)
    let mut column: i64 = 0
    let mut value: i64 = 1
    while column <= rowIndex {
        result.push(value)
        value = value * (rowIndex - column) / (column + 1)
        column = column + 1
    }
    return result
}

class Solution {
    micro getRow(self, rowIndex: i64): ArrayList<i64> {
        return get_row(rowIndex)
    }
}
