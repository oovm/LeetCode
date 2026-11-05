namespace leetcode.longest_line_of_consecutive_one_in_matrix;

using std.collection;

# 四个方向（上、左、左上、右上）各用一张 DP 表，额外留一圈 0 边界避免越界判断。
# 单趟扫描 O(m·n)。
micro fill_zeros(size: usize) -> ArrayList<i64> {
    let mut table: ArrayList<i64> = ArrayList::new(size)
    let mut index: usize = 0
    while index < size {
        table.push(0)
        index = index + 1
    }
    return table
}

[export(case: "camelCase")]
micro longest_line(mat: ArrayList<ArrayList<i64>>) -> i64 {
    let rows: usize = mat.length()
    if rows == 0 {
        return 0
    }
    let cols: usize = mat⁅0⁆.length()
    if cols == 0 {
        return 0
    }
    let stride: usize = cols + 2
    let total: usize = (rows + 2) * stride
    let mut up: ArrayList<i64> = fill_zeros(total)
    let mut left: ArrayList<i64> = fill_zeros(total)
    let mut diagonal: ArrayList<i64> = fill_zeros(total)
    let mut anti: ArrayList<i64> = fill_zeros(total)
    let mut best: i64 = 0

    let mut row: usize = 1
    while row <= rows {
        let mut col: usize = 1
        while col <= cols {
            if mat⁅row - 1⁆⁅col - 1⁆ != 0 {
                let cell: usize = row * stride + col
                up⁅cell⁆ = up⁅cell - stride⁆ + 1
                left⁅cell⁆ = left⁅cell - 1⁆ + 1
                diagonal⁅cell⁆ = diagonal⁅cell - stride - 1⁆ + 1
                anti⁅cell⁆ = anti⁅cell - stride + 1⁆ + 1
                if up⁅cell⁆ > best {
                    best = up⁅cell⁆
                }
                if left⁅cell⁆ > best {
                    best = left⁅cell⁆
                }
                if diagonal⁅cell⁆ > best {
                    best = diagonal⁅cell⁆
                }
                if anti⁅cell⁆ > best {
                    best = anti⁅cell⁆
                }
            }
            col = col + 1
        }
        row = row + 1
    }
    return best
}

class Solution {
    micro longestLine(self, mat: ArrayList<ArrayList<i64>>): i64 {
        return longest_line(mat)
    }
}
