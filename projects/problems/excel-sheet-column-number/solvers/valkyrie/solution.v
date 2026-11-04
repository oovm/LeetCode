namespace leetcode.excel_sheet_column_number;

[export(case: "camelCase")]
micro title_to_number(columnTitle: utf8) -> i64 {
    let mut result: i64 = 0
    let n: usize = columnTitle.length()
    let mut i: usize = 0
    while i < n {
        let code: u32 = columnTitle⁅i⁆ as u32
        result = result * 26 + (code as i64 - 64)
        i = i + 1
    }
    return result
}

class Solution {
    micro titleToNumber(self, columnTitle: utf8): i64 {
        return title_to_number(columnTitle)
    }
}
