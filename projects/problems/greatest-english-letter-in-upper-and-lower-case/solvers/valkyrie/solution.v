namespace leetcode.greatest_english_letter_in_upper_and_lower_case;

micro empty_text() -> utf8 {
    let mut builder: Utf8Builder = Utf8Builder::new(0)
    return builder.build()
}

[export(case: "camelCase")]
micro greatest_letter(s: utf8) -> utf8 {
    let mut lower: ArrayList<i64> = ArrayList::new(26)
    let mut upper: ArrayList<i64> = ArrayList::new(26)
    let mut i: usize = 0
    while i < 26 {
        lower.push(0)
        upper.push(0)
        i = i + 1
    }
    i = 0
    while i < s.length() {
        let c: u32 = s⁅i⁆ as u32
        if c >= 97 && c <= 122 {
            let idx: usize = (c - 97) as usize
            lower⁅idx⁆ = 1
        } else if c >= 65 && c <= 90 {
            let idx: usize = (c - 65) as usize
            upper⁅idx⁆ = 1
        }
        i = i + 1
    }
    let mut idx: i64 = 25
    while idx >= 0 {
        let k: usize = idx as usize
        if lower⁅k⁆.unwrap() == 1 && upper⁅k⁆.unwrap() == 1 {
            let mut builder: Utf8Builder = Utf8Builder::new(1)
            builder.append(char::from((65 + idx) as u32))
            return builder.build()
        }
        idx = idx - 1
    }
    return empty_text()
}

class Solution {
    micro greatestLetter(self, s: utf8): utf8 {
        return greatest_letter(s)
    }
}
