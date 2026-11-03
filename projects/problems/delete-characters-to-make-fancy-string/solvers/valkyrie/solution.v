namespace leetcode.delete_characters_to_make_fancy_string;

[export(case: "camelCase")]
micro make_fancy_string(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut prev: i64 = -1
    let mut run: i64 = 0
    let mut i: usize = 0
    while i < n {
        let code: i64 = s⁅i⁆ as u32 as i64
        if code == prev {
            run = run + 1
        } else {
            prev = code
            run = 1
        }
        if run < 3 {
            builder.append(s⁅i⁆)
        }
        i = i + 1
    }
    return builder.build()
}

class Solution {
    micro makeFancyString(self, s: utf8): utf8 {
        return make_fancy_string(s)
    }
}
