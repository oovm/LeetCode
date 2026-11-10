namespace leetcode.count_the_number_of_vowel_strings_in_range;

using std.collection;

# 统计 [left, right] 内首尾字母均为元音的单词数。
micro is_vowel(letter: char) -> bool {
    let code: u32 = letter as u32
    return code == 97 || code == 101 || code == 105 || code == 111 || code == 117
}

[export(case: "camelCase")]
micro vowelStrings(words: ArrayList<utf8>, left: i64, right: i64) -> i64 {
    let mut count: i64 = 0
    let mut index: usize = left as usize
    while index <= right as usize {
        let word: utf8 = words⁅index⁆
        if is_vowel(word⁅0⁆) && is_vowel(word⁅word.length() - 1⁆) {
            count = count + 1
        }
        index = index + 1
    }
    return count
}

class Solution {
    micro vowelStrings(self, words: ArrayList<utf8>, left: i64, right: i64): i64 {
        return vowelStrings(words, left, right)
    }
}
