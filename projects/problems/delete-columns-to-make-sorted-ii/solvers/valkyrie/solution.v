namespace leetcode.delete_columns_to_make_sorted_ii;

using std.collection;

# 逐列贪心：能保留就保留，并把本列已经严格升序的相邻词对标记为「已定序」。
# 一旦所有相邻对都已定序，后面的列必然可以保留，直接提前结束。
# 语料含行长度不齐的输入（F6），列宽沿用首串长度，越界位置跳过比较。
[export(case: "camelCase")]
micro min_deletion_size(strs: [utf8]) -> i64 {
    let rows: usize = strs.length()
    if rows == 0 {
        return 0
    }
    let columns: usize = strs⁅0⁆.byte_length()
    let mut pairs: usize = 0
    if rows > 1 {
        pairs = rows - 1
    }
    let mut settled: ArrayList<bool> = ArrayList::new(pairs)
    let mut fill: usize = 0
    while fill < pairs {
        settled.push(false)
        fill = fill + 1
    }
    let mut deletions: i64 = 0
    let mut column: usize = 0
    while column < columns {
        let mut keep: bool = true
        let mut row: usize = 0
        while row < pairs {
            if !settled⁅row⁆ {
                let left_width: usize = strs⁅row⁆.byte_length()
                let right_width: usize = strs⁅row + 1⁆.byte_length()
                if column < left_width {
                    if column < right_width {
                        if strs⁅row⁆.byte_at(column) > strs⁅row + 1⁆.byte_at(column) {
                            keep = false
                            break
                        }
                    }
                }
            }
            row = row + 1
        }
        if !keep {
            deletions = deletions + 1
            column = column + 1
            continue
        }
        row = 0
        while row < pairs {
            if !settled⁅row⁆ {
                let left_width: usize = strs⁅row⁆.byte_length()
                let right_width: usize = strs⁅row + 1⁆.byte_length()
                if column < left_width {
                    if column < right_width {
                        if strs⁅row⁆.byte_at(column) < strs⁅row + 1⁆.byte_at(column) {
                            settled⁅row⁆ = true
                        }
                    }
                }
            }
            row = row + 1
        }
        let mut all: bool = true
        let mut probe: usize = 0
        while probe < pairs {
            if !settled⁅probe⁆ {
                all = false
                break
            }
            probe = probe + 1
        }
        if all {
            break
        }
        column = column + 1
    }
    return deletions
}

class Solution {
    micro minDeletionSize(self, strs: [utf8]): i64 {
        return min_deletion_size(strs)
    }
}
