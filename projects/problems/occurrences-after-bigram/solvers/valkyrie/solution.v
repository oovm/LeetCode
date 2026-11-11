namespace leetcode.occurrences_after_bigram;

micro same_word(s: utf8, start: usize, length: usize, word: utf8) -> bool {
    if length != word.length() {
        return false
    }
    let mut i: usize = 0
    while i < length {
        if s⁅start + i⁆ != word⁅i⁆ {
            return false
        }
        i = i + 1
    }
    return true
}

# 先按空格切成词区间，再找连续 first + second 后的第三个词。
[export(case: "camelCase")]
micro find_ocurrences(text: utf8, first: utf8, second: utf8) -> [utf8] {
    let n: usize = text.length()
    let mut starts: ArrayList<usize> = ArrayList::new(n)
    let mut lengths: ArrayList<usize> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        while i < n && text⁅i⁆ as u32 == 32 {
            i = i + 1
        }
        if i < n {
            let start: usize = i
            while i < n && text⁅i⁆ as u32 != 32 {
                i = i + 1
            }
            starts.push(start)
            lengths.push(i - start)
        }
    }
    let count: usize = starts.length()
    let mut result: ArrayList<utf8> = ArrayList::new(0)
    let mut index: usize = 0
    while index + 2 < count {
        if same_word(text, starts⁅index⁆, lengths⁅index⁆, first) && same_word(text, starts⁅index + 1⁆, lengths⁅index + 1⁆, second) {
            let start: usize = starts⁅index + 2⁆
            let length: usize = lengths⁅index + 2⁆
            let mut builder: Utf8Builder = Utf8Builder::new(length)
            let mut j: usize = 0
            while j < length {
                builder.append(char::from(text⁅start + j⁆ as u32))
                j = j + 1
            }
            result.push(builder.build())
        }
        index = index + 1
    }
    return result.to_array()
}

class Solution {
    micro findOcurrences(self, text: utf8, first: utf8, second: utf8): [utf8] {
        return find_ocurrences(text, first, second)
    }
}
