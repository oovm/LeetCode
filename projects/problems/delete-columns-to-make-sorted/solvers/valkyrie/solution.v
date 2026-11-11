namespace leetcode.delete_columns_to_make_sorted;

using std.collection;

# 逐列检查：只要出现上一行字符大于下一行字符，该列必须删除。
[export(case: "camelCase")]
micro minDeletionSize(strs: [utf8]) -> i64 {
    let rows: usize = strs.length()
    let columns: usize = strs⁅0⁆.length()
    let mut removed: i64 = 0
    let mut column: usize = 0
    while column < columns {
        let mut row: usize = 1
        let mut unsorted: bool = false
        while row < rows && !unsorted {
            if (strs⁅row⁆⁅column⁆ as u32) < (strs⁅row - 1⁆⁅column⁆ as u32) {
                unsorted = true
            }
            row = row + 1
        }
        if unsorted {
            removed = removed + 1
        }
        column = column + 1
    }
    return removed
}

class Solution {
    micro minDeletionSize(self, strs: [utf8]): i64 {
        return minDeletionSize(strs)
    }
}
