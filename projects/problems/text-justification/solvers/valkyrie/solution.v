namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: `Utf8Builder` 按要求补空格；宽度按 `byte_length` 计，与题面 `maxWidth` 同单位。
micro fill_spaces(builder: Utf8Builder, count: usize) -> unit {
    let mut index: usize = 0
    while index < count {
        builder.append(" ")
        index = index + 1
    }
}

class Solution {
    [export(case: "camelCase")]
    micro fullJustify(words: ArrayList<utf8>, maxWidth: i64) -> ArrayList<utf8> {
        let width: usize = maxWidth as usize
        let total: usize = words.length()
        let mut lines: ArrayList<utf8> = ArrayList::new(0)
        let mut start: usize = 0
        while start < total {
            let mut end: usize = start + 1
            let mut line_bytes: usize = words⁅start⁆.byte_length()
            while end < total && line_bytes + 1 + words⁅end⁆.byte_length() <= width {
                line_bytes = line_bytes + 1 + words⁅end⁆.byte_length()
                end = end + 1
            }
            let count: usize = end - start
            let mut builder: Utf8Builder = Utf8Builder::new(width)
            if count == 1 {
                builder.append(words⁅start⁆)
                fill_spaces(builder, width - line_bytes)
            } else if end == total {
                let mut index: usize = start
                while index < end {
                    if index > start {
                        builder.append(" ")
                    }
                    builder.append(words⁅index⁆)
                    index = index + 1
                }
                fill_spaces(builder, width - line_bytes)
            } else {
                let gaps: usize = count - 1
                let total_spaces: usize = width - (line_bytes - gaps)
                let base: usize = total_spaces / gaps
                let extra: usize = total_spaces % gaps
                let mut index: usize = start
                while index < end {
                    builder.append(words⁅index⁆)
                    if index < end - 1 {
                        let gap_index: usize = index - start
                        let mut spaces: usize = base
                        if gap_index < extra {
                            spaces = spaces + 1
                        }
                        fill_spaces(builder, spaces)
                    }
                    index = index + 1
                }
            }
            lines.push(builder.build())
            start = end
        }
        return lines
    }
}
