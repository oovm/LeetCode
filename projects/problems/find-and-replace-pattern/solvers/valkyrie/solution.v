namespace leetcode.find_and_replace_pattern;

using std.collection;

# 双射匹配：正向与反向各一张 128 槽的「上次出现位置」表。
# 语料参考解按 `zip` 截断比较，所以只校验两串的共同前缀长度。
micro same_shape(word: utf8, pattern: utf8) -> bool {
    let length: usize = word.byte_length()
    if pattern.byte_length() < length {
        length = pattern.byte_length()
    }
    let mut forward: ArrayList<i64> = ArrayList::new(128)
    let mut backward: ArrayList<i64> = ArrayList::new(128)
    let mut fill: usize = 0
    while fill < 128 {
        forward.push(0)
        backward.push(0)
        fill = fill + 1
    }
    let mut index: usize = 0
    while index < length {
        let left: i64 = word.byte_at(index) as i64
        let right: i64 = pattern.byte_at(index) as i64
        if forward⁅left as usize⁆ != backward⁅right as usize⁆ {
            return false
        }
        let stamp: i64 = index as i64 + 1
        forward⁅left as usize⁆ = stamp
        backward⁅right as usize⁆ = stamp
        index = index + 1
    }
    return true
}

[export(case: "camelCase")]
micro find_and_replace_pattern(words: ArrayList<utf8>, pattern: utf8) -> ArrayList<utf8> {
    let mut out: ArrayList<utf8> = ArrayList::new(0)
    let mut index: usize = 0
    while index < words.length() {
        if same_shape(words⁅index⁆, pattern) {
            out.push(words⁅index⁆)
        }
        index = index + 1
    }
    return out
}

class Solution {
    micro findAndReplacePattern(self, words: ArrayList<utf8>, pattern: utf8): ArrayList<utf8> {
        return find_and_replace_pattern(words, pattern)
    }
}
