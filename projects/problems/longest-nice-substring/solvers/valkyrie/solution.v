namespace leetcode.longest_nice_substring;

[export(case: "camelCase")]
micro longest_nice_substring(s: utf8) -> utf8 {
    let n: usize = s.length()
    let mut best_len: usize = 0
    let mut best_start: usize = 0
    let mut i: usize = 0
    while i < n {
        let mut lower: i64 = 0
        let mut upper: i64 = 0
        let mut j: usize = i
        while j < n {
            let code: i64 = s⁅j⁆ as u32 as i64
            if code >= 97 && code <= 122 {
                let bit: i64 = 1 << (code - 97)
                lower = lower | bit
            } else if code >= 65 && code <= 90 {
                let bit: i64 = 1 << (code - 65)
                upper = upper | bit
            }
            let span: usize = j - i + 1
            if lower == upper && span > best_len {
                best_len = span
                best_start = i
            }
            j = j + 1
        }
        i = i + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(best_len)
    let mut k: usize = 0
    while k < best_len {
        builder.append(s⁅best_start + k⁆)
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro longestNiceSubstring(self, s: utf8): utf8 {
        return longest_nice_substring(s)
    }
}
