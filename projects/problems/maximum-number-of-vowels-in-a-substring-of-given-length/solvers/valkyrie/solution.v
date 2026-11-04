namespace leetcode.maximum_number_of_vowels_in_a_substring_of_given_length;

# 定长滑窗：先数满首窗的元音数，再逐位进出窗口，取历史最大。
# 元音判定只看 ASCII 码位，不依赖 `to_lower` 这类宿主合同。
micro is_vowel(letter: char) -> bool {
    let code: u32 = letter as u32
    if code == 97 || code == 101 || code == 105 || code == 111 || code == 117 {
        return true
    }
    return false
}

[export(case: "camelCase")]
micro maxVowels(s: utf8, k: i64) -> i64 {
    let width: usize = k as usize
    let mut count: i64 = 0
    let mut i: usize = 0
    while i < width {
        if is_vowel(s⁅i⁆) {
            count = count + 1
        }
        i = i + 1
    }

    let mut best: i64 = count
    let mut right: usize = width
    while right < s.length() {
        if is_vowel(s⁅right⁆) {
            count = count + 1
        }
        if is_vowel(s⁅right - width⁆) {
            count = count - 1
        }
        if count > best {
            best = count
        }
        right = right + 1
    }
    return best
}

class Solution {
    micro maxVowels(self, s: utf8, k: i64): i64 {
        return maxVowels(s, k)
    }
}
