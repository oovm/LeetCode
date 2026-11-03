namespace leetcode.spiral_matrix_ii;

# 按右、下、左、上四个边界收缩填充。
[export(case: "camelCase")]
micro generate_matrix(n: i64) -> ArrayList<ArrayList<i64>> {
    let mut matrix: ArrayList<ArrayList<i64>> = ArrayList::new(n as usize)
    let mut r: i64 = 0
    while r < n {
        let mut row: ArrayList<i64> = ArrayList::new(n as usize)
        let mut c: i64 = 0
        while c < n {
            row.push(0)
            c = c + 1
        }
        matrix.push(row)
        r = r + 1
    }
    let mut top: i64 = 0
    let mut bottom: i64 = n - 1
    let mut left: i64 = 0
    let mut right: i64 = n - 1
    let mut value: i64 = 1
    while top <= bottom && left <= right {
        let mut c: i64 = left
        while c <= right {
            matrix⁅top as usize⁆⁅c as usize⁆ = value
            value = value + 1
            c = c + 1
        }
        top = top + 1
        let mut row: i64 = top
        while row <= bottom {
            matrix⁅row as usize⁆⁅right as usize⁆ = value
            value = value + 1
            row = row + 1
        }
        right = right - 1
        if top <= bottom {
            let mut c: i64 = right
            while c >= left {
                matrix⁅bottom as usize⁆⁅c as usize⁆ = value
                value = value + 1
                c = c - 1
            }
            bottom = bottom - 1
        }
        if left <= right {
            let mut row: i64 = bottom
            while row >= top {
                matrix⁅row as usize⁆⁅left as usize⁆ = value
                value = value + 1
                row = row - 1
            }
            left = left + 1
        }
    }
    return matrix
}

class Solution {
    micro generateMatrix(self, n: i64): ArrayList<ArrayList<i64>> {
        return generate_matrix(n)
    }
}
