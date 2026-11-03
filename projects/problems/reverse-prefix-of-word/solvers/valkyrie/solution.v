namespace leetcode.reverse_prefix_of_word;

[export(case: "camelCase")]
micro reverse_prefix(word: utf8, ch: utf8) -> utf8 {
    let n: usize = word.length()
    let needle: i64 = ch⁅0⁆ as u32 as i64
    let mut at: i64 = -1
    let mut i: usize = 0
    while i < n {
        if (word⁅i⁆ as u32 as i64) == needle && at < 0 {
            at = i as i64
        }
        i = i + 1
    }
    if at < 0 {
        return word
    }
    let end: usize = at as usize
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut k: usize = end + 1
    while k > 0 {
        k = k - 1
        builder.append(word⁅k⁆)
    }
    let mut t: usize = end + 1
    while t < n {
        builder.append(word⁅t⁆)
        t = t + 1
    }
    return builder.build()
}

class Solution {
    micro reversePrefix(self, word: utf8, ch: utf8): utf8 {
        return reverse_prefix(word, ch)
    }
}
