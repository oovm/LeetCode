namespace leetcode.sorting_the_sentence;

[export(case: "camelCase")]
micro sort_sentence(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut max_pos: i64 = 0
    let mut i: usize = 0
    while i < n {
        while i < n && (s⁅i⁆ as u32 as i64) == 32 {
            i = i + 1
        }
        if i < n {
            let mut j: usize = i
            while j < n && (s⁅j⁆ as u32 as i64) != 32 {
                j = j + 1
            }
            let last: i64 = s⁅j - 1⁆ as u32 as i64 - 48
            if last > max_pos {
                max_pos = last
            }
            i = j
        }
    }
    let mut builder: Utf8Builder = Utf8Builder::new(n)
    let mut pos: i64 = 1
    let mut first: bool = true
    while pos <= max_pos {
        let mut j: usize = 0
        while j < n {
            while j < n && (s⁅j⁆ as u32 as i64) == 32 {
                j = j + 1
            }
            if j < n {
                let mut a: usize = j
                while a < n && (s⁅a⁆ as u32 as i64) != 32 {
                    a = a + 1
                }
                let last: i64 = s⁅a - 1⁆ as u32 as i64 - 48
                if last == pos {
                    if first == false {
                        builder.append(char::from(32))
                    }
                    let mut k: usize = j
                    while k + 1 < a {
                        builder.append(s⁅k⁆)
                        k = k + 1
                    }
                    first = false
                }
                j = a
            }
        }
        pos = pos + 1
    }
    return builder.build()
}

class Solution {
    micro sortSentence(self, s: utf8): utf8 {
        return sort_sentence(s)
    }
}
