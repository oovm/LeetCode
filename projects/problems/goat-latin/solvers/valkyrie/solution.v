namespace leetcode.goat_latin;

micro is_vowel_code(code: u32) -> bool {
    return code == 97 || code == 101 || code == 105 || code == 111 || code == 117 || code == 65 || code == 69 || code == 73 || code == 79 || code == 85
}

# 逐词按山羊拉丁规则改写，O(n)
[export(case: "camelCase")]
micro to_goat_latin(sentence: utf8) -> utf8 {
    let n: usize = sentence.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n * 3 + 8)
    let mut i: usize = 0
    let mut index: i64 = 0
    while i < n {
        if (sentence⁅i⁆ as u32) == 32 {
            builder.append(char::from(32))
            i = i + 1
        } else {
            let mut end: usize = i
            while end < n && (sentence⁅end⁆ as u32) != 32 {
                end = end + 1
            }
            index = index + 1
            let first: u32 = sentence⁅i⁆ as u32
            if is_vowel_code(first) {
                let mut p: usize = i
                while p < end {
                    builder.append(sentence⁅p⁆)
                    p = p + 1
                }
            } else {
                let mut p: usize = i + 1
                while p < end {
                    builder.append(sentence⁅p⁆)
                    p = p + 1
                }
                builder.append(sentence⁅i⁆)
            }
            builder.append(char::from(109))
            builder.append(char::from(97))
            let mut a: i64 = 0
            while a < index {
                builder.append(char::from(97))
                a = a + 1
            }
            i = end
        }
    }
    return builder.build()
}

class Solution {
    micro toGoatLatin(self, sentence: utf8): utf8 {
        return to_goat_latin(sentence)
    }
}
