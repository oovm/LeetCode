namespace leetcode.maximum_repeating_substring;

micro contains_text(hay: utf8, needle: utf8) -> bool {
    let n: usize = hay.length()
    let m: usize = needle.length()
    if m == 0 {
        return true
    }
    if n < m {
        return false
    }
    let mut i: usize = 0
    while i + m <= n {
        let mut j: usize = 0
        let mut same: bool = true
        while j < m && same {
            if (hay⁅i + j⁆ as u32) != (needle⁅j⁆ as u32) {
                same = false
            }
            j = j + 1
        }
        if same {
            return true
        }
        i = i + 1
    }
    return false
}

micro concat_text(a: utf8, b: utf8) -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(a.length() + b.length())
    let mut i: usize = 0
    while i < a.length() {
        builder.append(a⁅i⁆)
        i = i + 1
    }
    i = 0
    while i < b.length() {
        builder.append(b⁅i⁆)
        i = i + 1
    }
    return builder.build()
}

[export(case: "camelCase")]
micro max_repeating(sequence: utf8, word: utf8) -> i64 {
    let mut empty_builder: Utf8Builder = Utf8Builder::new(0)
    let mut text: utf8 = empty_builder.build()
    let mut k: i64 = 0
    let mut more: bool = true
    while more {
        let candidate: utf8 = concat_text(text, word)
        if contains_text(sequence, candidate) {
            text = candidate
            k = k + 1
        } else {
            more = false
        }
    }
    return k
}

class Solution {
    micro maxRepeating(self, sequence: utf8, word: utf8): i64 {
        return max_repeating(sequence, word)
    }
}
