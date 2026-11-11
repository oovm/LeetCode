namespace leetcode.count_prefixes_of_a_given_string;

using std.collection;

# 前缀判定用 `starts_with`：它已是 std 的既有入口，不必降级到 `slice` + 逐字比较。
[export(case: "camelCase")]
micro count_prefixes(words: [utf8], s: utf8) -> i64 {
    let count: usize = words.length()
    let mut hits: i64 = 0
    let mut i: usize = 0
    while i < count {
        let word: utf8 = words⁅i⁆
        if s.starts_with(word) {
            hits = hits + 1
        }
        i = i + 1
    }
    return hits
}

class Solution {
    micro countPrefixes(self, words: [utf8], s: utf8): i64 {
        return count_prefixes(words, s)
    }
}
