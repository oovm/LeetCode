namespace leetcode.check_if_the_sentence_is_pangram;

[export(case: "camelCase")]
micro check_if_pangram(sentence: utf8) -> bool {
    let n: usize = sentence.length()
    let mut mask: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: i64 = sentence⁅i⁆ as u32 as i64
        if code >= 97 && code <= 122 {
            let bit: i64 = 1 << (code - 97)
            mask = mask | bit
        }
        i = i + 1
    }
    let complete: i64 = 67108863
    return mask == complete
}

class Solution {
    micro checkIfPangram(self, sentence: utf8): bool {
        return check_if_pangram(sentence)
    }
}
