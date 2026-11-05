namespace leetcode.remove_comments;

using std.collection;

# 单遍状态机：行内 `//` 丢弃到行尾，`/* */` 跨行时把前后文接在同一行，
# 注释剥离后为空的行不输出。O(总字符数)。
[export(case: "camelCase")]
micro remove_comments(source: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut out: ArrayList<utf8> = ArrayList::new(source.length())
    let mut current: Utf8Builder = Utf8Builder::new(0)
    let mut in_block: bool = false
    let mut line_index: usize = 0
    while line_index < source.length() {
        let line: utf8 = source⁅line_index⁆
        let size: usize = line.byte_length()
        let mut cursor: usize = 0
        while cursor < size {
            let code: i64 = line.byte_at(cursor) as i64
            if in_block {
                if cursor + 1 < size && code == 42 && (line.byte_at(cursor + 1) as i64) == 47 {
                    in_block = false
                    cursor = cursor + 2
                } else {
                    cursor = cursor + 1
                }
            } else if code == 47 && cursor + 1 < size && (line.byte_at(cursor + 1) as i64) == 47 {
                cursor = size
            } else if code == 47 && cursor + 1 < size && (line.byte_at(cursor + 1) as i64) == 42 {
                in_block = true
                cursor = cursor + 2
            } else {
                current.append(char::from(code as u32))
                cursor = cursor + 1
            }
        }
        if !in_block {
            let text: utf8 = current.build()
            if text.byte_length() > 0 {
                out.push(text)
            }
            current = Utf8Builder::new(0)
        }
        line_index = line_index + 1
    }
    return out
}

class Solution {
    micro removeComments(self, source: ArrayList<utf8>): ArrayList<utf8> {
        return remove_comments(source)
    }
}
