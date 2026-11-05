namespace leetcode.number_of_matching_subsequences;

using std.collection;

# 每个候选词在 s 上做一次双指针贪心匹配，最坏 O(|s|)，总代价与输入规模线性相关。
[export(case: "camelCase")]
micro num_matching_subseq(s: utf8, words: ArrayList<utf8>) -> i64 {
    let source_size: usize = s.byte_length()
    let mut matched_words: i64 = 0
    let mut index: usize = 0
    while index < words.length() {
        let word: utf8 = words⁅index⁆
        let word_size: usize = word.byte_length()
        let mut source_at: usize = 0
        let mut word_at: usize = 0
        while source_at < source_size && word_at < word_size {
            if s.byte_at(source_at) == word.byte_at(word_at) {
                word_at = word_at + 1
            }
            source_at = source_at + 1
        }
        if word_at == word_size {
            matched_words = matched_words + 1
        }
        index = index + 1
    }
    return matched_words
}

class Solution {
    micro numMatchingSubseq(self, s: utf8, words: ArrayList<utf8>): i64 {
        return num_matching_subseq(s, words)
    }
}
