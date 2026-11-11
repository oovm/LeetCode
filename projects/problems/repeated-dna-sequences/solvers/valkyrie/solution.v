namespace leetcode.solution

using std.collection
using std.text

# 题内触发点: G12 —— 已见 10-mer 与已输出 10-mer 各一个 `HashSet<utf8>`，
# 按真实签名写 `HashSet::new()`（无容量参数），窗口总量 s.length() - 9 无法预分配。
#   [待补 API] micro new(capacity: usize) -> Self    # 预分配入口（G12），源码不存在
micro window_text(s: utf8, start: usize) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(10)
    let mut offset: usize = 0
    while offset < 10 {
        builder.append(char::from(s.byte_at(start + offset) as u32))
        offset = offset + 1
    }
    return builder.build()
}

class Solution {
    [export(case: "camelCase")]
    micro findRepeatedDnaSequences(s: utf8) -> [utf8] {
        let mut result: ArrayList<utf8> = ArrayList::new(0)
        let length: usize = s.byte_length()
        if length < 10 {
            return result.to_array()
        }

        let mut seen: HashSet<utf8> = HashSet::new()
        let mut emitted: HashSet<utf8> = HashSet::new()
        let mut start: usize = 0
        while start + 10 <= length {
            let window: utf8 = window_text(s, start)
            if seen.contains(window) {
                if !emitted.contains(window) {
                    emitted.insert(window)
                    result.push(window)
                }
            } else {
                seen.insert(window)
            }
            start = start + 1
        }
        return result.to_array()
    }
}
