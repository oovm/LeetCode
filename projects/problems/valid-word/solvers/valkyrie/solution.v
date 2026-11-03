namespace leetcode.valid_word;

micro is_vowel(code: u32) -> bool {
    return code == 65 || code == 69 || code == 73 || code == 79 || code == 85 || code == 97 || code == 101 || code == 105 || code == 111 || code == 117
}

# 长度至少 3、仅字母数字，且元音与辅音各至少一个。
[export(case: "camelCase")]
micro is_valid(word: utf8) -> bool {
    let n: usize = word.length()
    if n < 3 {
        return false
    }
    let mut vowels: i64 = 0
    let mut consonants: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: u32 = word⁅i⁆ as u32
        if code >= 48 && code <= 57 {
            i = i + 1
        } else if (code >= 65 && code <= 90) || (code >= 97 && code <= 122) {
            if is_vowel(code) {
                vowels = vowels + 1
            } else {
                consonants = consonants + 1
            }
            i = i + 1
        } else {
            return false
        }
    }
    return vowels > 0 && consonants > 0
}

class Solution {
    micro isValid(self, word: utf8): bool {
        return is_valid(word)
    }
}
