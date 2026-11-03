namespace leetcode.valid_word_abbreviation;

# 双指针按缩写规则推进，O(n)
[export(case: "camelCase")]
micro valid_word_abbreviation(word: utf8, abbr: utf8) -> bool {
    let wn: usize = word.length()
    let an: usize = abbr.length()
    let mut i: usize = 0
    let mut j: usize = 0
    while j < an {
        let code: u32 = abbr⁅j⁆ as u32
        if code >= 48 && code <= 57 {
            if code == 48 {
                return false
            }
            let mut skip: i64 = 0
            while j < an && (abbr⁅j⁆ as u32) >= 48 && (abbr⁅j⁆ as u32) <= 57 {
                skip = skip * 10 + (abbr⁅j⁆ as u32 as i64) - 48
                j = j + 1
            }
            let step: usize = skip as usize
            i = i + step
        } else {
            if i >= wn {
                return false
            }
            if (word⁅i⁆ as u32) != code {
                return false
            }
            i = i + 1
            j = j + 1
        }
    }
    return i == wn
}

class Solution {
    micro validWordAbbreviation(self, word: utf8, abbr: utf8): bool {
        return valid_word_abbreviation(word, abbr)
    }
}
