namespace leetcode.reverse_vowels_of_a_string;

# 阻塞：四 lane 同阻——`unresolved call <computed> in new at source/_.v:867..900`。入口闭包经
# `Array::push` 走到 `std::collection::array::new::<T>(old_len + 1)`，限定路径 + turbofish 仍未绑定到合同实例。

[export(case: "camelCase")]
micro reverse_vowels(s: utf8) -> utf8 {
    let mut chars: ArrayList<char> = ArrayList::new(s.length())
    let mut i: usize = 0
    while i < s.length() {
        chars.push(s⁅i⁆)
        i = i + 1
    }
    let mut left: usize = 0
    let mut right: usize = chars.length()
    if right > 0 {
        right = right - 1
    }
    while left < right {
        while left < right && !chars⁅left⁆.unwrap().is_ascii_vowel() {
            left = left + 1
        }
        while left < right && !chars⁅right⁆.unwrap().is_ascii_vowel() {
            right = right - 1
        }
        if left < right {
            let tmp: char = chars⁅left⁆.unwrap()
            chars⁅left⁆ = chars⁅right⁆.unwrap()
            chars⁅right⁆ = tmp
            left = left + 1
            right = right - 1
        }
    }
    let mut builder: Utf8Builder = Utf8Builder::new(chars.length() + 1)
    let mut k: usize = 0
    while k < chars.length() {
        builder.append(chars⁅k⁆.unwrap())
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro reverseVowels(self, s: utf8): utf8 {
        return reverse_vowels(s)
    }
}
