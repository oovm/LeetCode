namespace leetcode.remove_palindromic_subsequences;

[export(case: "camelCase")]
micro remove_palindrome_sub(s: utf8) -> i64 {
    let n: usize = s.length()
    let mut left: usize = 0
    let mut right: usize = n
    if right > 0 {
        right = right - 1
    }
    while left < right {
        if (s⁅left⁆ as u32) != (s⁅right⁆ as u32) {
            return 2
        }
        left = left + 1
        right = right - 1
    }
    return 1
}

class Solution {
    micro removePalindromeSub(self, s: utf8): i64 {
        return remove_palindrome_sub(s)
    }
}
