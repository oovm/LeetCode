namespace leetcode.split_strings_by_separator;

using std.collection;

# 逐词 `split` 后显式丢弃空段：`split` 的语义是「保留空段」，末尾分隔符还会补一个空段
# （`Utf8Text.v` L225-L228），所以空段过滤必须在调用方写，不能指望切分折叠空段。
[export(case: "camelCase")]
micro split_words_by_separator(words: ArrayList<utf8>, separator: utf8) -> ArrayList<utf8> {
    let mut result: ArrayList<utf8> = ArrayList::new(0)
    let count: usize = words.length()
    let mut i: usize = 0
    while i < count {
        let word: utf8 = words⁅i⁆
        let parts: [utf8] = word.split(separator)
        let mut j: usize = 0
        while j < parts.length() {
            let part: utf8 = parts⁅j⁆
            if part.length() > 0 {
                result.push(part)
            }
            j = j + 1
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro splitWordsBySeparator(self, words: ArrayList<utf8>, separator: utf8): ArrayList<utf8> {
        return split_words_by_separator(words, separator)
    }
}
