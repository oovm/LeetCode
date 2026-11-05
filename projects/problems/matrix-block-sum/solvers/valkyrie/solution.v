namespace leetcode.matrix_block_sum;

using std.collection;

# 二维前缀和：`prefix[i][j]` 表示左上角 1..i,1..j 的和，查询用容斥。
[export(case: "camelCase")]
micro matrixBlockSum(mat: ArrayList<ArrayList<i64>>, k: i64) -> ArrayList<ArrayList<i64>> {
    let m: usize = mat.length()
    let n: usize = mat⁅0⁆.length()

    let mut prefix: ArrayList<ArrayList<i64>> = ArrayList::new(m + 1)
    let mut r: usize = 0
    while r <= m {
        let mut row: ArrayList<i64> = ArrayList::new(n + 1)
        let mut c: usize = 0
        while c <= n {
            row.push(0)
            c = c + 1
        }
        prefix.push(row)
        r = r + 1
    }

    let mut i: usize = 1
    while i <= m {
        let mut j: usize = 1
        while j <= n {
            let value: i64 = mat⁅i - 1⁆⁅j - 1⁆
            prefix⁅i⁆⁅j⁆ = prefix⁅i - 1⁆⁅j⁆ + prefix⁅i⁆⁅j - 1⁆ - prefix⁅i - 1⁆⁅j - 1⁆ + value
            j = j + 1
        }
        i = i + 1
    }

    let mut answer: ArrayList<ArrayList<i64>> = ArrayList::new(m)
    i = 0
    while i < m {
        let mut row: ArrayList<i64> = ArrayList::new(n)
        let mut j: usize = 0
        while j < n {
            let mut x1: usize = 0
            if (i as i64) > k {
                x1 = (i as i64 - k) as usize
            }
            let mut y1: usize = 0
            if (j as i64) > k {
                y1 = (j as i64 - k) as usize
            }
            let mut x2: usize = m - 1
            if (i as i64) + k < (m - 1) as i64 {
                x2 = (i as i64 + k) as usize
            }
            let mut y2: usize = n - 1
            if (j as i64) + k < (n - 1) as i64 {
                y2 = (j as i64 + k) as usize
            }
            let value: i64 = prefix⁅x2 + 1⁆⁅y2 + 1⁆ - prefix⁅x1⁆⁅y2 + 1⁆ - prefix⁅x2 + 1⁆⁅y1⁆ + prefix⁅x1⁆⁅y1⁆
            row.push(value)
            j = j + 1
        }
        answer.push(row)
        i = i + 1
    }
    return answer
}

class Solution {
    micro matrixBlockSum(self, mat: ArrayList<ArrayList<i64>>, k: i64): ArrayList<ArrayList<i64>> {
        return matrixBlockSum(mat, k)
    }
}
