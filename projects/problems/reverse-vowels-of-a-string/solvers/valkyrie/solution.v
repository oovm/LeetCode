namespace leetcode.reverse_vowels_of_a_string;

micro is_vowel(code: u32) -> bool {
    return code == 97 || code == 101 || code == 105 || code == 111 || code == 117 || code == 65 || code == 69 || code == 73 || code == 79 || code == 85
}

# 双指针原地交换元音，O(n)
[export(case: "camelCase")]
micro reverse_vowels(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut chars: ArrayList<char> = ArrayList::new(n)
    let mut i: usize = 0
    while i < n {
        chars.push(s⁅i⁆)
        i = i + 1
    }
    let mut left: usize = 0
    let mut right: usize = n
    if right > 0 {
        right = right - 1
    }
    while left < right {
        if !is_vowel(chars⁅left⁆.unwrap() as u32) {
            left = left + 1
        } else if !is_vowel(chars⁅right⁆.unwrap() as u32) {
            right = right - 1
        } else {
            let tmp: char = chars⁅left⁆.unwrap()
            chars⁅left⁆ = chars⁅right⁆.unwrap()
            chars⁅right⁆ = tmp
            left = left + 1
            right = right - 1
        }
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut k: usize = 0
    while k < n {
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
