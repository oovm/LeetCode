namespace leetcode.percentage_of_letter_in_string;

[export(case: "camelCase")]
micro percentage_letter(s: utf8, letter: utf8) -> i64 {
    let target: u32 = letter⁅0⁆ as u32
    let n: usize = s.length()
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: u32 = s⁅i⁆ as u32
        if code == target {
            count = count + 1
        }
        i = i + 1
    }
    return count * 100 / n as i64
}

class Solution {
    micro percentageLetter(self, s: utf8, letter: utf8): i64 {
        return percentage_letter(s, letter)
    }
}
