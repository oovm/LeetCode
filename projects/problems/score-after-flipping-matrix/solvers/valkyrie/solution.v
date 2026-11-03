namespace leetcode.score_after_flipping_matrix;

# 每行首位翻成 1 后，逐列按 1 的个数取大的一侧计分。
[export(case: "camelCase")]
micro matrix_score(grid: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = grid.length()
    let first: ArrayList<i64> = grid⁅0⁆.unwrap()
    let cols: usize = first.length()
    let mut total: i64 = 0
    let mut c: usize = 0
    while c < cols {
        let mut ones: i64 = 0
        let mut r: usize = 0
        while r < rows {
            let row: ArrayList<i64> = grid⁅r⁆.unwrap()
            let value: i64 = row⁅c⁆.unwrap()
            let flipped: i64 = 1 - value
            if row⁅0⁆.unwrap() == 0 {
                ones = ones + flipped
            } else {
                ones = ones + value
            }
            r = r + 1
        }
        let zeros: i64 = (rows as i64) - ones
        let mut chosen: i64 = ones
        if zeros > chosen {
            chosen = zeros
        }
        total = total + chosen * (1 << ((cols as i64) - 1 - (c as i64)))
        c = c + 1
    }
    return total
}

class Solution {
    micro matrixScore(self, grid: ArrayList<ArrayList<i64>>): i64 {
        return matrix_score(grid)
    }
}
