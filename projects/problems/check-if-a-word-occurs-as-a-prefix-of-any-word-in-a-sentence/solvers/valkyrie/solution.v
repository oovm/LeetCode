namespace leetcode.check_if_a_word_occurs_as_a_prefix_of_any_word_in_a_sentence;

[export(case: "camelCase")]
micro is_prefix_of_word(sentence: utf8, search_word: utf8) -> i64 {
    let n: usize = sentence.length()
    let sw: usize = search_word.length()
    let mut result: i64 = -1
    let mut word_index: i64 = 0
    let mut found: bool = false
    let mut i: usize = 0
    while i < n && !found {
        while i < n && (sentence⁅i⁆ as u32) == 32 {
            i = i + 1
        }
        if i < n {
            word_index = word_index + 1
            let start: usize = i
            while i < n && (sentence⁅i⁆ as u32) != 32 {
                i = i + 1
            }
            let word_len: usize = i - start
            if word_len >= sw {
                let mut k: usize = 0
                let mut same: bool = true
                while k < sw && same {
                    if (sentence⁅start + k⁆ as u32) != (search_word⁅k⁆ as u32) {
                        same = false
                    }
                    k = k + 1
                }
                if same {
                    result = word_index
                    found = true
                }
            }
        }
    }
    return result
}

class Solution {
    micro isPrefixOfWord(self, sentence: utf8, searchWord: utf8): i64 {
        return is_prefix_of_word(sentence, searchWord)
    }
}
