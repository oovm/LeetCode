namespace leetcode.find_smallest_common_element_in_all_rows;

using std.collection;

# 每行单调递增；以第一行为候选源，按序找第一个在所有行都出现的值。
[export(case: "camelCase")]
micro smallestCommonElement(mat: [[i64]]) -> i64 {
    let rows: usize = mat.length()
    if rows == 0 {
        return -1
    }
    let first: [i64] = mat⁅0⁆
    loop candidate in first {
        let mut present: bool = true
        let mut row_index: usize = 1
        while row_index < rows {
            let row: [i64] = mat⁅row_index⁆
            if !row.contains(candidate) {
                present = false
            }
            row_index = row_index + 1
        }
        if present {
            return candidate
        }
    }
    return -1
}

class Solution {
    micro smallestCommonElement(self, mat: [[i64]]): i64 {
        return smallestCommonElement(mat)
    }
}
