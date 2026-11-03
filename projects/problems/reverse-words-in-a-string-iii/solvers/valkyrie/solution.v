namespace leetcode.reverse_words_in_a_string_iii;

# 逐词翻转，空格原样保留，O(n)
[export(case: "camelCase")]
micro reverse_words(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut i: usize = 0
    while i < n {
        if (s⁅i⁆ as u32) == 32 {
            builder.append(char::from(32))
            i = i + 1
        } else {
            let mut end: usize = i
            while end < n && (s⁅end⁆ as u32) != 32 {
                end = end + 1
            }
            let mut p: usize = end
            while p > i {
                builder.append(s⁅p - 1⁆)
                p = p - 1
            }
            i = end
        }
    }
    return builder.build()
}

class Solution {
    micro reverseWords(self, s: utf8): utf8 {
        return reverse_words(s)
    }
}
