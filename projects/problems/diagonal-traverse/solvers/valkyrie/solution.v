namespace leetcode.diagonal_traverse;

using std.collection;

# 按对角线编号 d 收集 row+column=d 的格；偶数对角线反向输出。
[export(case: "camelCase")]
micro findDiagonalOrder(mat: ArrayList<ArrayList<i64>>) -> ArrayList<i64> {
    let rows: usize = mat.length()
    let columns: usize = mat⁅0⁆.length()
    let mut answer: ArrayList<i64> = ArrayList::new(rows * columns)
    let mut diagonal: usize = 0
    while diagonal < rows + columns - 1 {
        let mut line: ArrayList<i64> = ArrayList::new(0)
        let mut row: usize = 0
        if diagonal >= columns {
            row = diagonal - columns + 1
        }
        let mut last: usize = diagonal
        if last >= rows {
            last = rows - 1
        }
        while row <= last {
            line.push(mat⁅row⁆⁅diagonal - row⁆)
            row = row + 1
        }
        if diagonal % 2 == 0 {
            line.reverse()
        }
        loop value in line {
            answer.push(value)
        }
        diagonal = diagonal + 1
    }
    return answer
}

class Solution {
    micro findDiagonalOrder(self, mat: ArrayList<ArrayList<i64>>): ArrayList<i64> {
        return findDiagonalOrder(mat)
    }
}
