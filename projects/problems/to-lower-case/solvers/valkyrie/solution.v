namespace leetcode.to_lower_case;

[export(case: "camelCase")]
micro to_lower_case(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = 0
    while i < n {
        let c: char = s⁅i⁆
        let code: u32 = c as u32
        if code >= 65 && code <= 90 {
            builder.append(char::from(code + 32))
        } else {
            builder.append(c)
        }
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro toLowerCase(self, s: utf8): utf8 {
        return to_lower_case(s)
    }
}
