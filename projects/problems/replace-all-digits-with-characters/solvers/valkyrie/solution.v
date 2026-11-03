namespace leetcode.replace_all_digits_with_characters;

[export(case: "camelCase")]
micro replace_digits(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = 0
    while i < n {
        let code: i64 = s⁅i⁆ as u32 as i64
        if i % 2 == 0 {
            builder.append(char::from(code as u32))
        } else {
            let prev: i64 = s⁅i - 1⁆ as u32 as i64
            let shifted: i64 = prev + (code - 48)
            builder.append(char::from(shifted as u32))
        }
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro replaceDigits(self, s: utf8): utf8 {
        return replace_digits(s)
    }
}
