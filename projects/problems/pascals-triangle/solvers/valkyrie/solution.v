namespace leetcode.pascals_triangle;

# 逐行用 C(r, c) 递推生成。
[export(case: "camelCase")]
micro generate(numRows: i64) -> ArrayList<ArrayList<i64>> {
    let mut result: ArrayList<ArrayList<i64>> = ArrayList::new(numRows as usize)
    let mut row: i64 = 0
    while row < numRows {
        let mut line: ArrayList<i64> = ArrayList::new((row + 1) as usize)
        let mut column: i64 = 0
        let mut value: i64 = 1
        while column <= row {
            line.push(value)
            value = value * (row - column) / (column + 1)
            column = column + 1
        }
        result.push(line)
        row = row + 1
    }
    return result
}

class Solution {
    micro generate(self, numRows: i64): ArrayList<ArrayList<i64>> {
        return generate(numRows)
    }
}
