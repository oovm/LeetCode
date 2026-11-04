namespace leetcode.keyboard_row;

using std.collection;

# 键盘三行是固定字符集：按行号归类后整词校验所有字母同属一行。
# 大小写归一用码位调整（ASCII `A..Z` 加 32），不依赖 `to_lower` 这类宿主合同。
micro keyboard_row_of(letter: char) -> i64 {
    let code: u32 = letter as u32
    let mut lower: u32 = code
    if code >= 65 {
        if code <= 90 {
            lower = code + 32
        }
    }
    if lower == 113 || lower == 119 || lower == 101 || lower == 114 || lower == 116 || lower == 121 || lower == 117 || lower == 105 || lower == 111 || lower == 112 {
        return 0
    }
    if lower == 97 || lower == 115 || lower == 100 || lower == 102 || lower == 103 || lower == 104 || lower == 106 || lower == 107 || lower == 108 {
        return 1
    }
    if lower == 122 || lower == 120 || lower == 99 || lower == 118 || lower == 98 || lower == 110 || lower == 109 {
        return 2
    }
    return 0 - 1
}

[export(case: "camelCase")]
micro findWords(words: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut result: ArrayList<utf8> = ArrayList::new(words.length())
    let mut i: usize = 0
    while i < words.length() {
        let word: utf8 = words⁅i⁆
        let mut same: bool = true
        if word.length() > 0 {
            let row: i64 = keyboard_row_of(word⁅0⁆)
            let mut k: usize = 1
            while k < word.length() {
                if keyboard_row_of(word⁅k⁆) != row {
                    same = false
                }
                k = k + 1
            }
        }
        if same {
            result.push(word)
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro findWords(self, words: ArrayList<utf8>): ArrayList<utf8> {
        return findWords(words)
    }
}
