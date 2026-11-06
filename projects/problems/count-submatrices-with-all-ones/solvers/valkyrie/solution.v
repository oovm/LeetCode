namespace leetcode.count_submatrices_with_all_ones;

using std.collection;

# 先算每行以当前列结尾的连续 1 长度，再对每个底部向上取列最小值累加，得到所有全 1 子矩形数。
[export(case: "camelCase")]
micro numSubmat(mat: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = mat.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = mat⁅0⁆.length()

    let mut runs: ArrayList<ArrayList<i64>> = ArrayList::new(rows)
    let mut row_index: usize = 0
    while row_index < rows {
        let row: ArrayList<i64> = mat⁅row_index⁆
        let mut run: ArrayList<i64> = ArrayList::new(cols)
        let mut col_index: usize = 0
        while col_index < cols {
            let value: i64 = row⁅col_index⁆
            if value == 1 {
                if col_index == 0 {
                    run.push(1)
                } else {
                    run.push(run⁅col_index - 1⁆ + 1)
                }
            } else {
                run.push(0)
            }
            col_index = col_index + 1
        }
        runs.push(run)
        row_index = row_index + 1
    }

    let mut answer: i64 = 0
    let mut bottom: usize = 0
    while bottom < rows {
        let bottom_run: ArrayList<i64> = runs⁅bottom⁆
        let mut col_index: usize = 0
        while col_index < cols {
            let mut limit: i64 = bottom_run⁅col_index⁆
            let mut step: usize = 0
            while step <= bottom {
                let top: usize = bottom - step
                let upper_run: ArrayList<i64> = runs⁅top⁆
                if upper_run⁅col_index⁆ < limit {
                    limit = upper_run⁅col_index⁆
                }
                answer = answer + limit
                step = step + 1
            }
            col_index = col_index + 1
        }
        bottom = bottom + 1
    }
    return answer
}

class Solution {
    micro numSubmat(self, mat: ArrayList<ArrayList<i64>>): i64 {
        return numSubmat(mat)
    }
}
