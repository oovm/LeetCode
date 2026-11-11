namespace leetcode.check_if_two_string_arrays_are_equivalent;

using std.collection;

# 两段拼接后整体比较；`concat` 是 `utf8` 既有的二元拼接，折叠累加即可，无需 builder。
micro join_all(words: [utf8]) -> utf8 {
    let mut text: utf8 = ""
    let mut i: usize = 0
    while i < words.length() {
        text = text.concat(words⁅i⁆)
        i = i + 1
    }
    return text
}

[export(case: "camelCase")]
micro array_strings_are_equal(word1: [utf8], word2: [utf8]) -> bool {
    let left: utf8 = join_all(word1)
    let right: utf8 = join_all(word2)
    return left == right
}

class Solution {
    micro arrayStringsAreEqual(self, word1: [utf8], word2: [utf8]): bool {
        return array_strings_are_equal(word1, word2)
    }
}
