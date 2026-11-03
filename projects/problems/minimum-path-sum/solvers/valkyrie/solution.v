namespace leetcode.minimum_path_sum;

# 一维滚动 DP，逐行覆盖。
[export(case: "camelCase")]
micro min_path_sum(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let m: usize = grid.length()
    let first_row: ArrayList<i64> = grid⁅0⁆.unwrap()
    let n: usize = first_row.length()
    let mut dp: ArrayList<i64> = ArrayList::new(n)
    let mut j: usize = 0
    while j < n {
        let cell: i64 = first_row⁅j⁆.unwrap()
        if j == 0 {
            dp.push(cell)
        } else {
            dp.push(dp⁅j - 1⁆.unwrap() + cell)
        }
        j = j + 1
    }
    let mut i: usize = 1
    while i < m {
        let row: ArrayList<i64> = grid⁅i⁆.unwrap()
        j = 0
        while j < n {
            let cell: i64 = row⁅j⁆.unwrap()
            let mut before: i64 = dp⁅j⁆.unwrap()
            if j > 0 {
                let left: i64 = dp⁅j - 1⁆.unwrap()
                if left < before {
                    before = left
                }
            }
            dp⁅j⁆ = before + cell
            j = j + 1
        }
        i = i + 1
    }
    return dp⁅n - 1⁆.unwrap()
}

class Solution {
    micro minPathSum(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return min_path_sum(grid)
    }
}
