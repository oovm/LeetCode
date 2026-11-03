namespace leetcode.strong_password_checker_ii;

[export(case: "camelCase")]
micro strong_password_checker_i_i(password: utf8) -> bool {
    let n: usize = password.length()
    if n < 8 {
        return false
    }
    let mut has_lower: bool = false
    let mut has_upper: bool = false
    let mut has_digit: bool = false
    let mut has_special: bool = false
    let mut has_prev: bool = false
    let mut prev: u32 = 0
    let mut i: usize = 0
    while i < n {
        let c: u32 = password⁅i⁆ as u32
        if c >= 97 && c <= 122 {
            has_lower = true
        } else if c >= 65 && c <= 90 {
            has_upper = true
        } else if c >= 48 && c <= 57 {
            has_digit = true
        } else {
            has_special = true
        }
        if has_prev && c == prev {
            return false
        }
        prev = c
        has_prev = true
        i = i + 1
    }
    return has_lower && has_upper && has_digit && has_special
}

class Solution {
    micro strongPasswordCheckerII(self, password: utf8): bool {
        return strong_password_checker_i_i(password)
    }
}
