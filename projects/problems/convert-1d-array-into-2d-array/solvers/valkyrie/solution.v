namespace leetcode.convert_1d_array_into_2d_array;

using std.collection;

# 长度不匹配直接返回空表；否则按行宽切段逐行构造。
[export(case: "camelCase")]
micro construct2DArray(original: ArrayList<i64>, m: i64, n: i64) -> ArrayList<ArrayList<i64>> {
    let mut out: ArrayList<ArrayList<i64>> = ArrayList::new(0)
    if m * n != original.length() as i64 {
        return out
    }
    let rows: usize = m as usize
    let width: usize = n as usize
    let mut row: usize = 0
    while row < rows {
        let mut line: ArrayList<i64> = ArrayList::new(width)
        let mut column: usize = 0
        while column < width {
            line.push(original⁅row * width + column⁆)
            column = column + 1
        }
        out.push(line)
        row = row + 1
    }
    return out
}

class Solution {
    micro construct2DArray(self, original: ArrayList<i64>, m: i64, n: i64): ArrayList<ArrayList<i64>> {
        return construct2DArray(original, m, n)
    }
}
