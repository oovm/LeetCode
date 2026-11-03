namespace leetcode.decrypt_string_from_alphabet_to_integer_mapping;

[export(case: "camelCase")]
micro freq_alphabets(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = 0
    while i < n {
        if i + 2 < n && (s⁅i + 2⁆ as u32) == 35 {
            let value: u32 = (s⁅i⁆ as u32 - 48) * 10 + (s⁅i + 1⁆ as u32 - 48)
            builder.append(char::from(value + 96))
            i = i + 3
        } else {
            let value: u32 = s⁅i⁆ as u32 - 48
            builder.append(char::from(value + 96))
            i = i + 1
        }
    }
    return builder.build()
}

class Solution {
    micro freqAlphabets(self, s: utf8): utf8 {
        return freq_alphabets(s)
    }
}
