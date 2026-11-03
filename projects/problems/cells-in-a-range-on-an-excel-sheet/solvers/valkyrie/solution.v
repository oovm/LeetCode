namespace leetcode.cells_in_a_range_on_an_excel_sheet;

# 逐列再逐行生成 s 覆盖的矩形区域。
[export(case: "camelCase")]
micro cells_in_range(s: utf8) -> ArrayList<utf8> {
    let first_column: u32 = s⁅0⁆ as u32
    let last_column: u32 = s⁅3⁆ as u32
    let first_row: i64 = s⁅1⁆ as u32 as i64 - 48
    let last_row: i64 = s⁅4⁆ as u32 as i64 - 48
    let mut result: ArrayList<utf8> = ArrayList::new(0)
    let mut column: u32 = first_column
    while column <= last_column {
        let mut row: i64 = first_row
        while row <= last_row {
            let mut builder: Utf8Builder = Utf8Builder::new(2)
            builder.append(char::from(column))
            builder.append(char::from((48 + row) as u32))
            result.push(builder.build())
            row = row + 1
        }
        column = column + 1
    }
    return result
}

class Solution {
    micro cellsInRange(self, s: utf8): ArrayList<utf8> {
        return cells_in_range(s)
    }
}
