namespace leetcode.word_pattern;

# 切词后双向映射同步校验，O(n)
[export(case: "camelCase")]
micro word_pattern(pattern: utf8, s: utf8) -> bool {
    let pn: usize = pattern.length()
    let n: usize = s.length()
    let mut words: usize = 0
    let mut in_word: bool = false
    let mut i: usize = 0
    while i < n {
        if (s⁅i⁆ as u32) == 32 {
            in_word = false
        } else {
            if !in_word {
                words = words + 1
                in_word = true
            }
        }
        i = i + 1
    }
    if words != pn {
        return false
    }
    let mut forward: HashMap<utf8, i64> = HashMap::new(0)
    let mut backward: HashMap<i64, utf8> = HashMap::new(0)
    let mut start: usize = 0
    let mut idx: usize = 0
    while idx < pn {
        while start < n && (s⁅start⁆ as u32) == 32 {
            start = start + 1
        }
        let mut end: usize = start
        while end < n && (s⁅end⁆ as u32) != 32 {
            end = end + 1
        }
        let mut builder: Utf8Builder = Utf8Builder::new(end - start + 1)
        let mut k: usize = start
        while k < end {
            builder.append(s⁅k⁆)
            k = k + 1
        }
        let word: utf8 = builder.build()
        let code: i64 = pattern⁅idx⁆ as u32 as i64
        if forward.contains_key(word) {
            if forward.get(word).unwrap() != code {
                return false
            }
        } else {
            forward.insert(word, code)
        }
        if backward.contains_key(code) {
            if !(backward.get(code).unwrap() == word) {
                return false
            }
        } else {
            backward.insert(code, word)
        }
        start = end
        idx = idx + 1
    }
    return true
}

class Solution {
    micro wordPattern(self, pattern: utf8, s: utf8): bool {
        return word_pattern(pattern, s)
    }
}
