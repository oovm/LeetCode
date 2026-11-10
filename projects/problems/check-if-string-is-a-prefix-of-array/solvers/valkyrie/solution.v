namespace leetcode.check_if_string_is_a_prefix_of_array;

using std.collection;

# 按序拼接单词，拼到恰好等于 s 即前缀成立；超过长度即失败。
[export(case: "camelCase")]
micro isPrefixString(s: utf8, words: ArrayList<utf8>) -> bool {
    let mut built: utf8 = ""
    loop word in words {
        built = built + word
        if built == s {
            return true
        }
        if built.length() > s.length() {
            return false
        }
    }
    return false
}

class Solution {
    micro isPrefixString(self, s: utf8, words: ArrayList<utf8>): bool {
        return isPrefixString(s, words)
    }
}
