namespace leetcode.maximal_square;

using std.collection;
using std.math;

# 滚动行 DP：边长 = min(上, 左, 左上) + 1；返回最大边长的平方。
[export(case: "camelCase")]
micro maximalSquare(matrix: ArrayList<ArrayList<utf8>>) -> i64 {
    let rows: usize = matrix.length()
    if rows == 0 || matrix⁅0⁆.length() == 0 {
        return 0
    }
    let cols: usize = matrix⁅0⁆.length()
    let mut prev: ArrayList<i64> = ArrayList::new(cols)
    let mut cur: ArrayList<i64> = ArrayList::new(cols)
    let mut slot: usize = 0
    while slot < cols {
        prev.push(0)
        cur.push(0)
        slot = slot + 1
    }
    let mut best: i64 = 0
    let mut i: usize = 0
    while i < rows {
        let mut j: usize = 0
        while j < cols {
            if matrix⁅i⁆⁅j⁆ == "1" {
                if i == 0 || j == 0 {
                    cur⁅j⁆ = 1
                } else {
                    cur⁅j⁆ = min(min(prev⁅j⁆, cur⁅j - 1⁆), prev⁅j - 1⁆) + 1
                }
                if cur⁅j⁆ > best {
                    best = cur⁅j⁆
                }
            } else {
                cur⁅j⁆ = 0
            }
            j = j + 1
        }
        slot = 0
        while slot < cols {
            prev⁅slot⁆ = cur⁅slot⁆
            cur⁅slot⁆ = 0
            slot = slot + 1
        }
        i = i + 1
    }
    return best * best
}

class Solution {
    micro maximalSquare(self, matrix: ArrayList<ArrayList<utf8>>): i64 {
        return maximalSquare(matrix)
    }
}
