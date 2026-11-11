namespace leetcode.expressive_words;

using std.collection;

# 行程长度编码比较：逐组匹配字符与重复次数。
# 词中每组次数不得超过 `s` 中对应组，且 `s` 中不足 3 次时必须相等。
micro stretchy(s: utf8, t: utf8) -> bool {
    let m: usize = s.byte_length()
    let n: usize = t.byte_length()
    if n > m {
        return false
    }
    let mut i: usize = 0
    let mut j: usize = 0
    while i < m && j < n {
        if s.byte_at(i) != t.byte_at(j) {
            return false
        }
        let mut cursor: usize = i
        while cursor < m && s.byte_at(cursor) == s.byte_at(i) {
            cursor = cursor + 1
        }
        let first: i64 = (cursor - i) as i64
        i = cursor
        cursor = j
        while cursor < n && t.byte_at(cursor) == t.byte_at(j) {
            cursor = cursor + 1
        }
        let second: i64 = (cursor - j) as i64
        j = cursor
        if first < second || (first < 3 && first != second) {
            return false
        }
    }
    return i == m && j == n
}

[export(case: "camelCase")]
micro expressive_words(s: utf8, words: [utf8]) -> i64 {
    let mut total: i64 = 0
    let mut index: usize = 0
    while index < words.length() {
        if stretchy(s, words⁅index⁆) {
            total = total + 1
        }
        index = index + 1
    }
    return total
}

class Solution {
    micro expressiveWords(self, s: utf8, words: [utf8]): i64 {
        return expressive_words(s, words)
    }
}
