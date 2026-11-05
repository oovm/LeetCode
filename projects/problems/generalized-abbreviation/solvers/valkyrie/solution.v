namespace leetcode.generalized_abbreviation;

using std.collection;

# 从左往右回溯：每个位置要么保留原字符，要么把一段替换成长度数字。
# 直接构造全部 2^n 个缩写，O(2^n·n)。
micro generate_into(word: utf8, position: i64, current: utf8, out: ArrayList<utf8>) -> unit {
    let length: i64 = word.byte_length() as i64
    if position >= length {
        out.push(current)
        return
    }
    let at: usize = position as usize
    let letter: char = char::from(word.byte_at(at) as u32)
    let mut with_letter: Utf8Builder = Utf8Builder::new(current.byte_length() + 1)
    with_letter.append(current)
    with_letter.append(letter)
    generate_into(word, position + 1, with_letter.build(), out)

    let mut stop: i64 = position + 1
    while stop <= length {
        let mut builder: Utf8Builder = Utf8Builder::new(current.byte_length() + 8)
        builder.append(current)
        builder.append_i64(stop - position)
        if stop < length {
            builder.append(char::from(word.byte_at(stop as usize) as u32))
        }
        generate_into(word, stop + 1, builder.build(), out)
        stop = stop + 1
    }
}

[export(case: "camelCase")]
micro generate_abbreviations(word: utf8) -> ArrayList<utf8> {
    let mut out: ArrayList<utf8> = ArrayList::new(0)
    let mut empty: Utf8Builder = Utf8Builder::new(0)
    generate_into(word, 0, empty.build(), out)
    return out
}

class Solution {
    micro generateAbbreviations(self, word: utf8): ArrayList<utf8> {
        return generate_abbreviations(word)
    }
}
