namespace leetcode.uncommon_words_from_two_sentences;

micro same_text(a: utf8, b: utf8) -> bool {
    if a.length() != b.length() {
        return false
    }
    let mut i: usize = 0
    while i < a.length() {
        if a⁅i⁆ != b⁅i⁆ {
            return false
        }
        i = i + 1
    }
    return true
}

micro tokenize(s: utf8) -> ArrayList<utf8> {
    let n: usize = s.length()
    let mut words: ArrayList<utf8> = ArrayList::new(0)
    let mut i: usize = 0
    while i < n {
        while i < n && s⁅i⁆ as u32 == 32 {
            i = i + 1
        }
        if i < n {
            let start: usize = i
            while i < n && s⁅i⁆ as u32 != 32 {
                i = i + 1
            }
            let mut builder: Utf8Builder = Utf8Builder::new(i - start)
            let mut j: usize = start
            while j < i {
                builder.append(char::from(s⁅j⁆ as u32))
                j = j + 1
            }
            words.push(builder.build())
        }
    }
    return words
}

micro count_word(words: ArrayList<utf8>, target: utf8) -> i64 {
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < words.length() {
        if same_text(words⁅i⁆, target) {
            count = count + 1
        }
        i = i + 1
    }
    return count
}

# 两句话合并后恰好出现一次的词，按首次出现顺序输出。
[export(case: "camelCase")]
micro uncommon_from_sentences(s1: utf8, s2: utf8) -> ArrayList<utf8> {
    let words1: ArrayList<utf8> = tokenize(s1)
    let words2: ArrayList<utf8> = tokenize(s2)
    let mut result: ArrayList<utf8> = ArrayList::new(0)
    let mut i: usize = 0
    while i < words1.length() {
        let word: utf8 = words1⁅i⁆
        if count_word(words1, word) + count_word(words2, word) == 1 {
            result.push(word)
        }
        i = i + 1
    }
    i = 0
    while i < words2.length() {
        let word: utf8 = words2⁅i⁆
        if count_word(words1, word) + count_word(words2, word) == 1 {
            result.push(word)
        }
        i = i + 1
    }
    return result
}

class Solution {
    micro uncommonFromSentences(self, s1: utf8, s2: utf8): ArrayList<utf8> {
        return uncommon_from_sentences(s1, s2)
    }
}
