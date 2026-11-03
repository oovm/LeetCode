namespace leetcode.number_of_valid_words_in_a_sentence;

micro is_letter(code: i64) -> bool {
    if code >= 97 && code <= 122 {
        return true
    }
    return code >= 65 && code <= 90
}

micro is_punctuation(code: i64) -> bool {
    if code == 46 {
        return true
    }
    if code == 44 {
        return true
    }
    return code == 33
}

[export(case: "camelCase")]
micro count_valid_words(sentence: utf8) -> i64 {
    let n: usize = sentence.length()
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < n {
        while i < n && (sentence⁅i⁆ as u32 as i64) == 32 {
            i = i + 1
        }
        if i < n {
            let mut j: usize = i
            while j < n && (sentence⁅j⁆ as u32 as i64) != 32 {
                j = j + 1
            }
            let mut valid: bool = true
            let mut hyphens: i64 = 0
            let mut marks: i64 = 0
            let mut k: usize = i
            while k < j && valid {
                let code: i64 = sentence⁅k⁆ as u32 as i64
                if is_letter(code) == false {
                    if code == 45 {
                        hyphens = hyphens + 1
                        if hyphens > 1 {
                            valid = false
                        } else if k == i || k + 1 >= j {
                            valid = false
                        } else {
                            let before: i64 = sentence⁅k - 1⁆ as u32 as i64
                            let after: i64 = sentence⁅k + 1⁆ as u32 as i64
                            if is_letter(before) == false || is_letter(after) == false {
                                valid = false
                            }
                        }
                    } else if is_punctuation(code) {
                        marks = marks + 1
                        if marks > 1 || k + 1 != j {
                            valid = false
                        }
                    } else if code >= 48 && code <= 57 {
                        valid = false
                    }
                }
                k = k + 1
            }
            if valid {
                count = count + 1
            }
            i = j
        }
    }
    return count
}

class Solution {
    micro countValidWords(self, sentence: utf8): i64 {
        return count_valid_words(sentence)
    }
}
