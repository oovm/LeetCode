namespace leetcode.make_a_square_with_the_same_color;

using std.collection;

# 枚举 2x2 子方格：统计 `'B'` 数量；不等于 2 则可通过一次变色达成全同色。
[export(case: "camelCase")]
micro canMakeSquare(grid: ArrayList<ArrayList<utf8>>) -> bool {
    let mut i: usize = 0
    while i + 1 < grid.length() {
        let mut j: usize = 0
        while j + 1 < grid⁅0⁆.length() {
            let mut b: i64 = 0
            if grid⁅i⁆⁅j⁆⁅0⁆ as u32 == 66 {
                b = b + 1
            }
            if grid⁅i⁆⁅j + 1⁆⁅0⁆ as u32 == 66 {
                b = b + 1
            }
            if grid⁅i + 1⁆⁅j⁆⁅0⁆ as u32 == 66 {
                b = b + 1
            }
            if grid⁅i + 1⁆⁅j + 1⁆⁅0⁆ as u32 == 66 {
                b = b + 1
            }
            if b != 2 {
                return true
            }
            j = j + 1
        }
        i = i + 1
    }
    return false
}

class Solution {
    micro canMakeSquare(self, grid: ArrayList<ArrayList<utf8>>): bool {
        return canMakeSquare(grid)
    }
}
