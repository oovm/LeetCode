namespace leetcode.lonely_pixel_i;

using std.collection;

# 行/列计数：统计每行每列的 `'B'` 个数；格为 `'B'` 且行列计数都为 1 即独立像素。
[export(case: "camelCase")]
micro findLonelyPixel(picture: ArrayList<ArrayList<utf8>>) -> i64 {
    let rows: usize = picture.length()
    let cols: usize = picture⁅0⁆.length()
    let mut row_count: ArrayList<i64> = ArrayList::new(rows)
    let mut col_count: ArrayList<i64> = ArrayList::new(cols)
    let mut i: usize = 0
    while i < rows {
        row_count.push(0)
        i = i + 1
    }
    i = 0
    while i < cols {
        col_count.push(0)
        i = i + 1
    }
    i = 0
    while i < rows {
        let mut j: usize = 0
        while j < cols {
            if picture⁅i⁆⁅j⁆⁅0⁆ as u32 == 66 {
                row_count⁅i⁆ = row_count⁅i⁆ + 1
                col_count⁅j⁆ = col_count⁅j⁆ + 1
            }
            j = j + 1
        }
        i = i + 1
    }
    let mut count: i64 = 0
    i = 0
    while i < rows {
        let mut j: usize = 0
        while j < cols {
            if picture⁅i⁆⁅j⁆⁅0⁆ as u32 == 66 && row_count⁅i⁆ == 1 && col_count⁅j⁆ == 1 {
                count = count + 1
            }
            j = j + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro findLonelyPixel(self, picture: ArrayList<ArrayList<utf8>>): i64 {
        return findLonelyPixel(picture)
    }
}
