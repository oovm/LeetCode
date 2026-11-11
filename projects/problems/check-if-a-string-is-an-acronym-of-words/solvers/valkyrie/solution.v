namespace leetcode.check_if_a_string_is_an_acronym_of_words;

using std.collection;

# 首字母比较全程停在 `char` 上：`utf8` 的 Cardinal 视图直接给 `char`，`char` 有 `==`/`!=`，
# 不需要把首字母重新拼成字符串再比较，也不碰任何哈希或序关系。
[export(case: "camelCase")]
micro is_acronym(words: [utf8], s: utf8) -> bool {
    let count: usize = words.length()
    if count != s.length() {
        return false
    }

    let mut i: usize = 0
    while i < count {
        let word: utf8 = words⁅i⁆
        let initial: char = word⁅0⁆
        let expected: char = s⁅i⁆
        if initial != expected {
            return false
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro isAcronym(self, words: [utf8], s: utf8): bool {
        return is_acronym(words, s)
    }
}
