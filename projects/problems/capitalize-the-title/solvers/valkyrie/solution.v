namespace leetcode.capitalize_the_title;

[export(case: "camelCase")]
micro capitalize_title(title: utf8) -> utf8 {
    let n: usize = title.length()
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut first: bool = true
    let mut i: usize = 0
    while i < n {
        while (i < n) && ((title⁅i⁆ as u32) == 32) {
            i = i + 1
        }
        let start: usize = i
        while (i < n) && ((title⁅i⁆ as u32) != 32) {
            i = i + 1
        }
        if i > start {
            if !first {
                builder.append(char::from(32))
            }
            first = false
            let len: usize = i - start
            if len > 2 {
                let c0: u32 = title⁅start⁆ as u32
                if c0 >= 97 && c0 <= 122 {
                    builder.append(char::from(c0 - 32))
                } else {
                    builder.append(char::from(c0))
                }
                let mut j: usize = start + 1
                while j < i {
                    let c: u32 = title⁅j⁆ as u32
                    if c >= 65 && c <= 90 {
                        builder.append(char::from(c + 32))
                    } else {
                        builder.append(char::from(c))
                    }
                    j = j + 1
                }
            } else {
                let mut k: usize = start
                while k < i {
                    let c: u32 = title⁅k⁆ as u32
                    if c >= 65 && c <= 90 {
                        builder.append(char::from(c + 32))
                    } else {
                        builder.append(char::from(c))
                    }
                    k = k + 1
                }
            }
        }
    }
    return builder.build()
}

class Solution {
    micro capitalizeTitle(self, title: utf8): utf8 {
        return capitalize_title(title)
    }
}
