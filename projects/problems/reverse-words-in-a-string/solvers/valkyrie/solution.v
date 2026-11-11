namespace leetcode.reverse_words_in_a_string;

using std.collection;

# 按空白类切词并丢弃空段；std 的 utf8 只有精确分隔符 split，没有 split_whitespace（G18）。
[export(case: "camelCase")]
micro reverse_words(s: utf8) -> utf8 {
    let words: [utf8] = s.split_whitespace()
    let mut result: utf8 = ""
    let mut i: usize = words.length()
    while i > 0 {
        i = i - 1
        if result.length() > 0 {
            result = result ++ " "
        }
        result = result ++ words⁅i⁆
    }
    return result
}

class Solution {
    micro reverseWords(self, s: utf8): utf8 {
        return reverse_words(s)
    }
}
