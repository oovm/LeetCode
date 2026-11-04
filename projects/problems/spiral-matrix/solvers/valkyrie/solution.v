namespace leetcode.spiral_matrix;

# 边界层收缩：每轮依次走完上边 / 右边 / 下边 / 左边，四条边各向内收一格。
# O(m·n) 时间 / O(1) 额外空间；嵌套载体只读，逐格经 `⁅ ⁆` 取值。
[export(case: "camelCase")]
micro spiral_order(matrix: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let mut result: ArrayList<i64> = ArrayList::new(0)
    let rows: usize = matrix.length()
    if rows == 0 {
        return result
    }
    let cols: usize = matrix⁅0⁆.length()
    if cols == 0 {
        return result
    }

    let mut top: i64 = 0
    let mut bottom: i64 = (rows - 1) as i64
    let mut left: i64 = 0
    let mut right: i64 = (cols - 1) as i64

    while top <= bottom && left <= right {
        let mut col: i64 = left
        while col <= right {
            result.push(matrix⁅top as usize⁆⁅col as usize⁆)
            col = col + 1
        }
        top = top + 1

        let mut row: i64 = top
        while row <= bottom {
            result.push(matrix⁅row as usize⁆⁅right as usize⁆)
            row = row + 1
        }
        right = right - 1

        # 单行 / 单列时避免重复走同一条边。
        if top <= bottom {
            col = right
            while col >= left {
                result.push(matrix⁅bottom as usize⁆⁅col as usize⁆)
                col = col - 1
            }
            bottom = bottom - 1
        }

        if left <= right {
            row = bottom
            while row >= top {
                result.push(matrix⁅row as usize⁆⁅left as usize⁆)
                row = row - 1
            }
            left = left + 1
        }
    }
    return result
}

class Solution {
    micro spiralOrder(self, matrix: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return spiral_order(matrix)
    }
}
