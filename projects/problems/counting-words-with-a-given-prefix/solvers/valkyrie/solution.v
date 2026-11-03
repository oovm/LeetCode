namespace leetcode.counting_words_with_a_given_prefix;

micro starts_with(word: utf8, pref: utf8) -> bool {
    let wn: usize = word.length()
    let pn: usize = pref.length()
    if wn < pn {
        return false
    }
    let mut i: usize = 0
    while i < pn {
        if word⁅i⁆ as u32 != pref⁅i⁆ as u32 {
            return false
        }
        i = i + 1
    }
    return true
}

[export(case: "camelCase")]
micro prefix_count(words: ArrayList<utf8>, pref: utf8) -> i64 {
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < words.length() {
        if starts_with(words⁅i⁆, pref) {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

class Solution {
    micro prefixCount(self, words: ArrayList<utf8>, pref: utf8): i64 {
        return prefix_count(words, pref)
    }
}
