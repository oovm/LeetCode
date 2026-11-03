namespace leetcode.check_if_word_equals_summation_of_two_words;

micro word_value(word: utf8) -> i64 {
    let n: usize = word.length()
    let mut value: i64 = 0
    let mut i: usize = 0
    while i < n {
        value = value * 10 + (word⁅i⁆ as u32 as i64 - 97)
        i = i + 1
    }
    return value
}

[export(case: "camelCase")]
micro is_sum_equal(firstWord: utf8, secondWord: utf8, targetWord: utf8) -> bool {
    return word_value(firstWord) + word_value(secondWord) == word_value(targetWord)
}

class Solution {
    micro isSumEqual(self, firstWord: utf8, secondWord: utf8, targetWord: utf8): bool {
        return is_sum_equal(firstWord, secondWord, targetWord)
    }
}
