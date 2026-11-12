namespace leetcode.find_and_replace_in_string;

using std.collection;

micro matches_at(text: utf8, start: usize, word: utf8) -> bool {
    if start + word.byte_length() > text.byte_length() {
        return false
    }
    let mut offset: usize = 0
    while offset < word.byte_length() {
        if text.byte_at(start + offset) != word.byte_at(offset) {
            return false
        }
        offset = offset + 1
    }
    return true
}

# 先标记每个起点能否匹配，再单遍重建字符串：命中就整段替换并跳过源长度。
[export(case: "camelCase")]
micro find_replace_string(s: utf8, indices: [i64], sources: [utf8], targets: [utf8]) -> utf8 {
    let length: usize = s.byte_length()
    let mut owner: ArrayList<i64> = ArrayList::new(length)
    let mut fill: usize = 0
    while fill < length {
        owner.push(-1)
        fill = fill + 1
    }
    let mut entry: usize = 0
    while entry < indices.length() {
        let start: usize = indices⁅entry⁆ as usize
        if start < length && matches_at(s, start, sources⁅entry⁆) {
            owner⁅start⁆ = entry as i64
        }
        entry = entry + 1
    }

    let mut capacity: usize = length
    let mut extra: usize = 0
    while extra < targets.length() {
        capacity = capacity + targets⁅extra⁆.byte_length()
        extra = extra + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(capacity)
    let mut cursor: usize = 0
    while cursor < length {
        let slot: i64 = owner⁅cursor⁆
        if slot >= 0 {
            let which: usize = slot as usize
            builder.append(targets⁅which⁆)
            cursor = cursor + sources⁅which⁆.byte_length()
        } else {
            builder.append(char::from(s.byte_at(cursor) as u32))
            cursor = cursor + 1
        }
    }
    return builder.build()
}

class Solution {
    micro findReplaceString(self, s: utf8, indices: [i64], sources: [utf8], targets: [utf8]): utf8 {
        return find_replace_string(s, indices, sources, targets)
    }
}
