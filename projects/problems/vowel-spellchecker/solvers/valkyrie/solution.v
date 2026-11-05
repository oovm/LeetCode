namespace leetcode.vowel_spellchecker;

using std.collection;

micro equal_text(left: utf8, right: utf8) -> bool {
    if left.length() != right.length() {
        return false
    }
    let mut index: usize = 0
    while index < left.length() {
        if left⁅index⁆ != right⁅index⁆ {
            return false
        }
        index = index + 1
    }
    return true
}

micro lower_text(word: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(word.length())
    let mut index: usize = 0
    while index < word.length() {
        let code: u32 = word⁅index⁆ as u32
        let mut out: u32 = code
        if code >= 65 {
            if code <= 90 {
                out = code + 32
            }
        }
        builder.append(char::from(out))
        index = index + 1
    }
    return builder.build()
}

micro is_vowel(code: u32) -> bool {
    if code == 97 {
        return true
    }
    if code == 101 {
        return true
    }
    if code == 105 {
        return true
    }
    if code == 111 {
        return true
    }
    if code == 117 {
        return true
    }
    return false
}

micro vowel_pattern(word: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(word.length())
    let mut index: usize = 0
    while index < word.length() {
        let code: u32 = word⁅index⁆ as u32
        if is_vowel(code) {
            builder.append(char::from(42))
        } else {
            builder.append(char::from(code))
        }
        index = index + 1
    }
    return builder.build()
}

# 三级匹配：原文命中 → 全部小写后首次命中 → 元音通配后首次命中，逐级短路。
[export(case: "camelCase")]
micro spellchecker(wordlist: ArrayList<utf8>, queries: ArrayList<utf8>) -> ArrayList<utf8> {
    let mut result: ArrayList<utf8> = ArrayList::new(queries.length())
    let mut query_index: usize = 0
    while query_index < queries.length() {
        let query: utf8 = queries⁅query_index⁆
        let mut answer: utf8 = Utf8Builder::new(0).build()
        let mut found: bool = false

        let mut word_index: usize = 0
        while word_index < wordlist.length() {
            if equal_text(wordlist⁅word_index⁆, query) {
                answer = wordlist⁅word_index⁆
                found = true
            }
            word_index = word_index + 1
        }

        if found == false {
            let lowered: utf8 = lower_text(query)
            word_index = 0
            while word_index < wordlist.length() {
                if equal_text(lower_text(wordlist⁅word_index⁆), lowered) {
                    answer = wordlist⁅word_index⁆
                    found = true
                    break
                }
                word_index = word_index + 1
            }
        }

        if found == false {
            let pattern: utf8 = vowel_pattern(lower_text(query))
            word_index = 0
            while word_index < wordlist.length() {
                if equal_text(vowel_pattern(lower_text(wordlist⁅word_index⁆)), pattern) {
                    answer = wordlist⁅word_index⁆
                    found = true
                    break
                }
                word_index = word_index + 1
            }
        }

        result.push(answer)
        query_index = query_index + 1
    }
    return result
}

class Solution {
    micro spellchecker(self, wordlist: ArrayList<utf8>, queries: ArrayList<utf8>): ArrayList<utf8> {
        return spellchecker(wordlist, queries)
    }
}
