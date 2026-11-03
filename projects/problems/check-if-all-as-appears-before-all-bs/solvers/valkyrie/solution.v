namespace leetcode.check_if_all_as_appears_before_all_bs;

[export(case: "camelCase")]
micro check_string(s: utf8) -> bool {
    let n: usize = s.length()
    let mut seen_b: bool = false
    let mut i: usize = 0
    while i < n {
        let code: u32 = s⁅i⁆ as u32
        if code == 98 {
            seen_b = true
        } else if code == 97 && seen_b {
            return false
        }
        i = i + 1
    }
    return true
}

class Solution {
    micro checkString(self, s: utf8): bool {
        return check_string(s)
    }
}
