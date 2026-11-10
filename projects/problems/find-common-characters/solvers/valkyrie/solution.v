namespace leetcode.find_common_characters;

using std.collection;
using std.text;

# 逐词统计 26 字母频次，与公共频次表逐位取最小；最后按频次展开成单字符串列表。
# 题内触发点: 单字符文本构造走 `Utf8Builder::new(0)` + `append(char)` + `build()`；
# `char as utf8` 直接转换不存在（G4 关联面，待复验）。
micro single_char_text(letter: char) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    builder.append(letter)
    return builder.build()
}

micro word_frequency(word: utf8) -> ArrayList<i64> {
    let mut freq: ArrayList<i64> = ArrayList::new(26)
    let mut slot: usize = 0
    while slot < 26 {
        freq.push(0)
        slot = slot + 1
    }
    let mut index: usize = 0
    while index < word.length() {
        let letter: usize = ((word⁅index⁆ as u32) as i64 - 97) as usize
        freq⁅letter⁆ = freq⁅letter⁆ + 1
        index = index + 1
    }
    return freq
}

[export(case: "camelCase")]
micro commonChars(words: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut common: ArrayList<i64> = word_frequency(words⁅0⁆)
    let mut word: usize = 1
    while word < words.length() {
        let freq: ArrayList<i64> = word_frequency(words⁅word⁆)
        let mut letter: usize = 0
        while letter < 26 {
            if freq⁅letter⁆ < common⁅letter⁆ {
                common⁅letter⁆ = freq⁅letter⁆
            }
            letter = letter + 1
        }
        word = word + 1
    }
    let mut out: ArrayList<utf8> = ArrayList::new(0)
    let mut letter: usize = 0
    while letter < 26 {
        let mut repeat: i64 = 0
        while repeat < common⁅letter⁆ {
            out.push(single_char_text(((97 + letter as i64) as u32) as char))
            repeat = repeat + 1
        }
        letter = letter + 1
    }
    return out
}

class Solution {
    micro commonChars(self, words: ArrayList<utf8>): ArrayList<utf8> {
        return commonChars(words)
    }
}
