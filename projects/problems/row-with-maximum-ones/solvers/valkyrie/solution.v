namespace leetcode.row_with_maximum_ones;

using std.collection;

# 依次统计每行的 1，只在严格更大时替换，平局保留较小行号。
[export(case: "camelCase")]
micro rowAndMaximumOnes(mat: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let rows: usize = mat.length()
    let mut best_row: i64 = 0
    let mut best_count: i64 = -1
    let mut row: usize = 0
    while row < rows {
        let mut count: i64 = 0
        let mut column: usize = 0
        while column < mat⁅row⁆.length() {
            if mat⁅row⁆⁅column⁆ == 1 {
                count = count + 1
            }
            column = column + 1
        }
        if count > best_count {
            best_count = count
            best_row = row as i64
        }
        row = row + 1
    }
    let mut answer: ArrayList<i64> = ArrayList::new(2)
    answer.push(best_row)
    answer.push(best_count)
    return answer
}

class Solution {
    micro rowAndMaximumOnes(self, mat: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return rowAndMaximumOnes(mat)
    }
}
