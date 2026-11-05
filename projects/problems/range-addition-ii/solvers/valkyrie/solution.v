namespace leetcode.range_addition_ii;

# 已还原（`172b944a` 修复块退出写回 + 当前 addon `25132ccf`）：`loop <var> in <ArrayList>` 可用。
# 每次操作都从 (0, 0) 起覆盖，重叠次数最多的格子由「所有操作行列上界的最小值」唯一确定。
[export(case: "camelCase")]
micro maxCount(m: i64, n: i64, ops: ArrayList<ArrayList<i64>>) -> i64 {
    if ops.length() == 0 {
        return m * n
    }
    let mut min_row: i64 = m
    let mut min_col: i64 = n
    loop op in ops {
        let row_bound: i64 = op⁅0⁆
        let col_bound: i64 = op⁅1⁆
        if row_bound < min_row {
            min_row = row_bound
        }
        if col_bound < min_col {
            min_col = col_bound
        }
    }
    return min_row * min_col
}

class Solution {
    micro maxCount(self, m: i64, n: i64, ops: ArrayList<ArrayList<i64>>): i64 {
        return maxCount(m, n, ops)
    }
}
