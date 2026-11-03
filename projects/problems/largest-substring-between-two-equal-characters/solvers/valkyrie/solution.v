namespace leetcode.largest_substring_between_two_equal_characters;

[export(case: "camelCase")]
micro max_length_between_equal_characters(s: utf8) -> i64 {
    let mut first: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        first.push(-1)
        i = i + 1
    }
    let mut best: i64 = -1
    i = 0
    while i < s.length() {
        let code: u32 = s⁅i⁆ as u32
        let idx: usize = (code as usize) - 97
        if first⁅idx⁆.unwrap() < 0 {
            first⁅idx⁆ = i as i64
        } else {
            let span: i64 = i as i64 - first⁅idx⁆.unwrap() - 1
            if span > best {
                best = span
            }
        }
        i = i + 1
    }
    return best
}

class Solution {
    micro maxLengthBetweenEqualCharacters(self, s: utf8): i64 {
        return max_length_between_equal_characters(s)
    }
}
