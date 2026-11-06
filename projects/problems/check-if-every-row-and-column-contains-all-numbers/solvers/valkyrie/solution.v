namespace leetcode.check_if_every_row_and_column_contains_all_numbers;

using std.collection;

# 参照解以「集合基数等于 n」为准：行内与列内元素必须互不相同。
# 列遍历按 zip 语义取最短行长度，避免参差矩阵越界。
[export(case: "camelCase")]
micro checkValid(matrix: ArrayList<ArrayList<i64>>) -> bool {
    let n: usize = matrix.length()
    let mut index: usize = 0
    while index < n {
        let row: ArrayList<i64> = matrix⁅index⁆
        let row_length: usize = row.length()
        let mut distinct: i64 = 0
        let mut left: usize = 0
        while left < row_length {
            let mut duplicate: bool = false
            let mut right: usize = 0
            while right < left {
                if row⁅right⁆ == row⁅left⁆ {
                    duplicate = true
                    break
                }
                right = right + 1
            }
            if !duplicate {
                distinct = distinct + 1
            }
            left = left + 1
        }
        if distinct as usize != n {
            return false
        }
        index = index + 1
    }
    let mut shortest: usize = matrix⁅0⁆.length()
    index = 1
    while index < n {
        if matrix⁅index⁆.length() < shortest {
            shortest = matrix⁅index⁆.length()
        }
        index = index + 1
    }
    let mut column: usize = 0
    while column < shortest {
        let mut distinct: i64 = 0
        let mut top: usize = 0
        while top < n {
            let mut duplicate: bool = false
            let mut other: usize = 0
            while other < top {
                if matrix⁅other⁆⁅column⁆ == matrix⁅top⁆⁅column⁆ {
                    duplicate = true
                    break
                }
                other = other + 1
            }
            if !duplicate {
                distinct = distinct + 1
            }
            top = top + 1
        }
        if distinct as usize != n {
            return false
        }
        column = column + 1
    }
    return true
}

class Solution {
    micro checkValid(self, matrix: ArrayList<ArrayList<i64>>): bool {
        return checkValid(matrix)
    }
}
