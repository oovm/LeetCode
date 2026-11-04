namespace leetcode.maximum_number_of_words_found_in_sentences;

using std.collection;

# 按空白类切词；std 的 utf8 缺 split_whitespace（G18）。
[export(case: "camelCase")]
micro most_words_found(sentences: ArrayList<utf8>) -> i64 {
    let mut best: i64 = 0
    loop sentence in sentences {
        let words: [utf8] = sentence.split_whitespace()
        let count: i64 = words.length() as i64
        if count > best {
            best = count
        }
    }
    return best
}

class Solution {
    micro mostWordsFound(self, sentences: ArrayList<utf8>): i64 {
        return most_words_found(sentences)
    }
}
