namespace leetcode.find_special_substring_of_length_k;

# 存在长度恰为 k 的同字符游程即满足。
[export(case: "camelCase")]
micro has_special_substring(s: utf8, k: i64) -> bool {
    let n: usize = s.length()
    let mut run: i64 = 1
    let mut i: usize = 1
    while i <= n {
        let same: bool = i < n && (s⁅i⁆ as u32) == (s⁅i - 1⁆ as u32)
        if same {
            run = run + 1
        } else {
            if run == k {
                return true
            }
            run = 1
        }
        i = i + 1
    }
    return false
}

class Solution {
    micro hasSpecialSubstring(self, s: utf8, k: i64): bool {
        return has_special_substring(s, k)
    }
}
