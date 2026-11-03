namespace leetcode.remove_vowels_from_a_string;

micro is_vowel(code: u32) -> bool {
    return code == 97 || code == 101 || code == 105 || code == 111 || code == 117
}

[export(case: "camelCase")]
micro remove_vowels(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = 0
    while i < n {
        let c: char = s⁅i⁆
        if !is_vowel(c as u32) {
            builder.append(c)
        }
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro removeVowels(self, s: utf8): utf8 {
        return remove_vowels(s)
    }
}
