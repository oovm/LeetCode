namespace leetcode.reverse_only_letters;

micro is_letter_code(code: u32) -> bool {
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
}

# 双指针跳过非字母后交换，O(n)
[export(case: "camelCase")]
micro reverse_only_letters(s: utf8) -> utf8 {
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
        if !is_letter_code(chars⁅left⁆.unwrap() as u32) {
            left = left + 1
        } else if !is_letter_code(chars⁅right⁆.unwrap() as u32) {
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
    micro reverseOnlyLetters(self, s: utf8): utf8 {
        return reverse_only_letters(s)
    }
}
