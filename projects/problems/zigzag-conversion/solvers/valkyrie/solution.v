namespace leetcode.zigzag_conversion;

[export(case: "camelCase")]
micro convert(s: utf8, num_rows: i64) -> utf8 {
    if num_rows <= 1 {
        return s
    }
    let n: usize = s.length()
    let rows: i64 = num_rows
    let cycle: i64 = 2 * (rows - 1)
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut r: i64 = 0
    while r < rows {
        let mut idx: i64 = r
        while idx < n as i64 {
            builder.append(s.char_at(idx as usize).unwrap())
            if r > 0 && r < rows - 1 {
                let mirror: i64 = idx + cycle - 2 * r
                if mirror < n as i64 {
                    builder.append(s.char_at(mirror as usize).unwrap())
                }
            }
            idx = idx + cycle
        }
        r = r + 1
    }
    return builder.build()
}

class Solution {
    micro convert(self, s: utf8, numRows: i64): utf8 {
        return convert(s, numRows)
    }
}
