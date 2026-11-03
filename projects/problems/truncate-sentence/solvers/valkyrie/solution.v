namespace leetcode.truncate_sentence;

[export(case: "camelCase")]
micro truncate_sentence(s: utf8, k: i64) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut words: i64 = 0
    let mut first: bool = true
    let mut i: usize = 0
    while i < n && words < k {
        while i < n && (s⁅i⁆ as u32 as i64) == 32 {
            i = i + 1
        }
        if i < n {
            if first == false {
                builder.append(char::from(32))
            }
            while i < n && (s⁅i⁆ as u32 as i64) != 32 {
                builder.append(s⁅i⁆)
                i = i + 1
            }
            words = words + 1
            first = false
        }
    }
    return builder.build()
}

class Solution {
    micro truncateSentence(self, s: utf8, k: i64): utf8 {
        return truncate_sentence(s, k)
    }
}
