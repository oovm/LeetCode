namespace leetcode.rearrange_spaces_between_words;

[export(case: "camelCase")]
micro reorder_spaces(text: utf8) -> utf8 {
    let n: usize = text.length()
    let mut spaces: i64 = 0
    let mut words: ArrayList<utf8> = ArrayList::new(0)
    let mut i: usize = 0
    while i < n {
        if (text⁅i⁆ as u32) == 32 {
            spaces = spaces + 1
            i = i + 1
        } else {
            let mut word: Utf8Builder = Utf8Builder::new(n)
            while i < n && (text⁅i⁆ as u32) != 32 {
                word.append(text⁅i⁆)
                i = i + 1
            }
            words.push(word.build())
        }
    }
    let wc: i64 = words.length() as i64
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    if wc == 0 {
        let mut s: i64 = 0
        while s < spaces {
            builder.append(char::from(32))
            s = s + 1
        }
        return builder.build()
    }
    if wc == 1 {
        let only: utf8 = words⁅0⁆.unwrap()
        let mut p: usize = 0
        while p < only.length() {
            builder.append(only⁅p⁆)
            p = p + 1
        }
        let mut s: i64 = 0
        while s < spaces {
            builder.append(char::from(32))
            s = s + 1
        }
        return builder.build()
    }
    let gap: i64 = spaces / (wc - 1)
    let rest: i64 = spaces % (wc - 1)
    let mut w: usize = 0
    while w < words.length() {
        if w > 0 {
            let mut g: i64 = 0
            while g < gap {
                builder.append(char::from(32))
                g = g + 1
            }
        }
        let word: utf8 = words⁅w⁆.unwrap()
        let mut p: usize = 0
        while p < word.length() {
            builder.append(word⁅p⁆)
            p = p + 1
        }
        w = w + 1
    }
    let mut r: i64 = 0
    while r < rest {
        builder.append(char::from(32))
        r = r + 1
    }
    return builder.build()
}

class Solution {
    micro reorderSpaces(self, text: utf8): utf8 {
        return reorder_spaces(text)
    }
}
