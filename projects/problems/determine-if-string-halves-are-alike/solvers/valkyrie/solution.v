namespace leetcode.determine_if_string_halves_are_alike;

micro is_vowel_code(code: u32) -> bool {
    let lower: u32 = code
    if code >= 65 && code <= 90 {
        lower = code + 32
    }
    return lower == 97 || lower == 101 || lower == 105 || lower == 111 || lower == 117
}

[export(case: "camelCase")]
micro halves_are_alike(s: utf8) -> bool {
    let n: usize = s.length()
    let half: usize = n / 2
    let mut left: i64 = 0
    let mut right: i64 = 0
    let mut i: usize = 0
    while i < half {
        if is_vowel_code(s⁅i⁆ as u32) {
            left = left + 1
        }
        if is_vowel_code(s⁅half + i⁆ as u32) {
            right = right + 1
        }
        i = i + 1
    }
    return left == right
}

class Solution {
    micro halvesAreAlike(self, s: utf8): bool {
        return halves_are_alike(s)
    }
}
