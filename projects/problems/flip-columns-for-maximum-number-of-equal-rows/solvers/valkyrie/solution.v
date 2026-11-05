namespace leetcode.flip_columns_for_maximum_number_of_equal_rows;

using std.collection;

# 把每行首位移位到 0 后当作规范键；同键行数即翻转后相等的最多行数。
# `HashMap<utf8, _>` 的哈希入口在 R30 仍退化为线性，但键长受列数限制，先按理想语义写。
[export(case: "camelCase")]
micro max_equal_rows_after_flips(matrix: ArrayList<ArrayList<i64>>) -> i64 {
    let mut counts: HashMap<utf8, i64> = HashMap::new(matrix.length())
    let mut best: i64 = 0
    let mut row_index: usize = 0
    while row_index < matrix.length() {
        let row: ArrayList<i64> = matrix⁅row_index⁆
        let shift: i64 = row⁅0⁆
        let mut builder: Utf8Builder = Utf8Builder::new(row.length())
        let mut column: usize = 0
        while column < row.length() {
            let bit: i64 = row⁅column⁆ ^ shift
            builder.append(char::from(48 + (bit as u32)))
            column = column + 1
        }
        let key: utf8 = builder.build()
        let mut seen: i64 = 0
        if counts.contains_key(key) {
            seen = counts.get(key).unwrap()
        }
        counts.insert(key, seen + 1)
        if seen + 1 > best {
            best = seen + 1
        }
        row_index = row_index + 1
    }
    return best
}

class Solution {
    micro maxEqualRowsAfterFlips(self, matrix: ArrayList<ArrayList<i64>>): i64 {
        return max_equal_rows_after_flips(matrix)
    }
}
