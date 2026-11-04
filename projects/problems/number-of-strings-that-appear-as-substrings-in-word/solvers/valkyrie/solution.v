namespace leetcode.number_of_strings_that_appear_as_substrings_in_word;

using std.collection;

# `contains` 是 std 里唯一的子串谓词（`index_of` 的 bool 化封装），命中只计数不再取位置。
[export(case: "camelCase")]
micro num_of_strings(patterns: ArrayList<utf8>, word: utf8) -> i64 {
    let count: usize = patterns.length()
    let mut hits: i64 = 0
    let mut i: usize = 0
    while i < count {
        let pattern: utf8 = patterns⁅i⁆
        if word.contains(pattern) {
            hits = hits + 1
        }
        i = i + 1
    }
    return hits
}

class Solution {
    micro numOfStrings(self, patterns: ArrayList<utf8>, word: utf8): i64 {
        return num_of_strings(patterns, word)
    }
}
