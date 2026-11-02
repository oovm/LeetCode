namespace leetcode.length_of_last_word;

[export(case: "camelCase")]
micro length_of_last_word(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut i: usize = n
    let mut len: i64 = 0
    let mut seen_word: bool = false
    let mut done: bool = false
    while i > 0 && done == false {
        let c: u32 = s⁅i - 1⁆ as u32
        if c == 32 {
            if seen_word {
                done = true
            }
        } else {
            seen_word = true
            len = len + 1
        }
        i = i - 1
    }
    return len
}

class Solution {
    micro lengthOfLastWord(self, s: utf8): i64 {
        return length_of_last_word(s)
    }
}
