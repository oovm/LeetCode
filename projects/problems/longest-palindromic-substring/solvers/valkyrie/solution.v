namespace leetcode.longest_palindromic_substring;

[export(case: "camelCase")]
micro longest_palindrome(s: utf8) -> utf8 {
    let n: usize = s.length()
    if n <= 1 {
        return s
    }
    let mut best_start: usize = 0
    let mut best_len: usize = 1
    let mut center: usize = 0
    let last_center: usize = 2 * n - 2
    while center <= last_center {
        let mut l: usize = center / 2
        let mut r: usize = (center + 1) / 2
        while r < n {
            if s.char_at(l).unwrap() as u32 != s.char_at(r).unwrap() as u32 {
                break
            }
            let len: usize = r - l + 1
            if len > best_len {
                best_len = len
                best_start = l
            }
            if l == 0 {
                break
            }
            l = l - 1
            r = r + 1
        }
        center = center + 1
    }
    let mut builder: Utf8Builder = Utf8Builder::new(best_len)
    let mut k: usize = 0
    while k < best_len {
        builder.append(s.char_at(best_start + k).unwrap())
        k = k + 1
    }
    return builder.build()
}

class Solution {
    micro longestPalindrome(self, s: utf8): utf8 {
        return longest_palindrome(s)
    }
}
