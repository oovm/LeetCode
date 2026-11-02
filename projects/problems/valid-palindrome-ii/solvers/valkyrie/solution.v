namespace leetcode.valid_palindrome_ii;

micro pal_range(s: utf8, lo: usize, hi: usize) -> bool {
    let mut i: usize = lo
    let mut j: usize = hi
    while i < j {
        let a: u32 = s⁅i⁆ as u32
        let b: u32 = s⁅j⁆ as u32
        if a != b {
            return false
        }
        i = i + 1
        j = j - 1
    }
    return true
}

[export(case: "camelCase")]
micro valid_palindrome(s: utf8) -> bool {
    let n: usize = s.length()
    if n == 0 {
        return true
    }
    let mut i: usize = 0
    let mut j: usize = n - 1
    while i < j {
        let a: u32 = s⁅i⁆ as u32
        let b: u32 = s⁅j⁆ as u32
        if a != b {
            return pal_range(s, i + 1, j) || pal_range(s, i, j - 1)
        }
        i = i + 1
        j = j - 1
    }
    return true
}

class Solution {
    micro validPalindrome(self, s: utf8): bool {
        return valid_palindrome(s)
    }
}
