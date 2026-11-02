namespace leetcode.excel_sheet_column_number;

[export(case: "camelCase")]
micro title_to_number(s: utf8) -> i64 {
    let mut result: i64 = 0
    let n: usize = s.length()
    let mut i: usize = 0
    while i < n {
        let code: u32 = s⁅i⁆ as u32
        result = result * 26 + (code as i64 - 64)
        i = i + 1
    }
    return result
}

class Solution {
    micro titleToNumber(self, s: utf8): i64 {
        return title_to_number(s)
    }
}
