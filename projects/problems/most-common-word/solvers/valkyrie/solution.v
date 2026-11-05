namespace leetcode.most_common_word;

using std.collection;
using std.text;

# `HashMap<utf8, i64>` / `HashSet<utf8>` 在本批 addon 上仍不可编译
# （`std::hash` 合同实例未进依赖导入，见 gap-ledger 的 string-hash 组），
# 因此用「词表 + 计数表」的线性查找；真写法是 `HashMap<utf8, i64>` + `HashSet<utf8>`。
# 还原判据：`std::hash#` 合同实例进入 consumer_imports 后改回容器写法。

micro lower_code(code: u32) -> u32 {
    if code >= 65 && code <= 90 {
        return code + 32
    }
    return code
}

micro is_letter(code: u32) -> bool {
    if code >= 65 && code <= 90 {
        return true
    }
    if code >= 97 && code <= 122 {
        return true
    }
    return false
}

micro equal_text(left: utf8, right: utf8) -> bool {
    if left.length() != right.length() {
        return false
    }
    let mut index: usize = 0
    while index < left.length() {
        if left⁅index⁆ != right⁅index⁆ {
            return false
        }
        index = index + 1
    }
    return true
}

micro banned_contains(word: utf8, banned: ArrayList<utf8>) -> bool {
    let mut index: usize = 0
    while index < banned.length() {
        if equal_text(word, banned⁅index⁆) {
            return true
        }
        index = index + 1
    }
    return false
}

[export(case: "camelCase")]
micro most_common_word(paragraph: utf8, banned: ArrayList<utf8>) -> utf8 {
    let mut words: ArrayList<utf8> = ArrayList::new(0)
    let mut counts: ArrayList<i64> = ArrayList::new(0)

    let mut builder: Utf8Builder = Utf8Builder::new(paragraph.length())
    let mut pending: bool = false
    let mut index: usize = 0
    while index <= paragraph.length() {
        let at_end: bool = index == paragraph.length()
        let code: u32 = if at_end { 0 } else { paragraph⁅index⁆ as u32 }
        if !at_end && is_letter(code) {
            builder.append(char::from(lower_code(code)))
            pending = true
        } else if pending {
            let word: utf8 = builder.build()
            if !banned_contains(word, banned) {
                let mut slot: usize = 0
                let mut found: bool = false
                while slot < words.length() {
                    if equal_text(words⁅slot⁆, word) {
                        counts⁅slot⁆ = counts⁅slot⁆ + 1
                        found = true
                    }
                    slot = slot + 1
                }
                if !found {
                    words.push(word)
                    counts.push(1)
                }
            }
            builder = Utf8Builder::new(paragraph.length())
            pending = false
        }
        index = index + 1
    }

    let mut best: usize = 0
    let mut best_count: i64 = 0
    let mut cursor: usize = 0
    while cursor < words.length() {
        if counts⁅cursor⁆ > best_count {
            best_count = counts⁅cursor⁆
            best = cursor
        }
        cursor = cursor + 1
    }
    return words⁅best⁆
}

class Solution {
    micro mostCommonWord(self, paragraph: utf8, banned: ArrayList<utf8>): utf8 {
        return most_common_word(paragraph, banned)
    }
}
