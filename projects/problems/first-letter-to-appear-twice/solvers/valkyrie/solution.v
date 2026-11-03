namespace leetcode.first_letter_to_appear_twice;

micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

[export(case: "camelCase")]
micro repeated_character(s: utf8) -> utf8 {
    let mut seen: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        seen.push(0)
        i = i + 1
    }
    i = 0
    while i < s.length() {
        let c: u32 = s⁅i⁆ as u32
        let idx: usize = (c - 97) as usize
        if seen⁅idx⁆ == 1 {
            let mut builder: Utf8Builder = Utf8Builder::new(1)
            builder.append(char::from(c))
            return builder.build()
        }
        seen⁅idx⁆ = 1
        i = i + 1
    }
    return empty_text()
}

class Solution {
    micro repeatedCharacter(self, s: utf8): utf8 {
        return repeated_character(s)
    }
}
