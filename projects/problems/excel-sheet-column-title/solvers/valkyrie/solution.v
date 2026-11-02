namespace leetcode.excel_sheet_column_title;

[export(case: "camelCase")]
micro convert_to_title(column_number: i64) -> utf8 {
    let mut n: i64 = column_number
    let mut builder: Utf8Builder = Utf8Builder::new(8)
    while n > 0 {
        n = n - 1
        let rem: i64 = n % 26
        builder.append(char::from((rem + 65) as u32))
        n = n / 26
    }
    let s: utf8 = builder.build()
    let len: usize = s.length()
    let mut out: Utf8Builder = Utf8Builder::new(len)
    let mut i: usize = len
    while i > 0 {
        out.append(s⁅i - 1⁆)
        i = i - 1
    }
    return out.build()
}

class Solution {
    micro convertToTitle(self, columnNumber: i64): utf8 {
        return convert_to_title(columnNumber)
    }
}
